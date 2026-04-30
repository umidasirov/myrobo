import { useState, useEffect } from "react";
import {
  CodeOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
  BarsOutlined,
  BookOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useData } from "../../datacontect";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import notificationApi from "../../generic/notificition";
import { useCourseAccess } from "../../hooks/useCourseAccess";
import { Helmet } from "react-helmet-async";
import { toSlug } from "../kirish";
import { notification, Modal } from "antd";
import SubscriptionOferta from "../subscription";

function getShortIdFromSlug(slug) {
  if (!slug) return null;
  const parts = slug.split("--");
  return parts[parts.length - 1];
}

function KirishComponentsID() {
  const { data, fetchCourse } = useData();
  const { slug } = useParams();
  const notify = notificationApi();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [sections, setSections] = useState([]);
  const [topicsMap, setTopicsMap] = useState({});
  const [loadingSections, setLoadingSections] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showOfertaModal, setShowOfertaModal] = useState(false);
  const [hasReadOferta, setHasReadOferta] = useState(false);

  const shortId = getShortIdFromSlug(slug);
  const findData = data?.find((item) => item?.id?.startsWith(shortId));
  const courseId = findData?.id;

  const { isBought, loading: accessLoading } = useCourseAccess(courseId);

  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      try {
        await fetchCourse();
      } catch (err) {
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [slug]);

  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/kurslar/" || !slug) {
      navigate("/", { replace: true });
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!accessLoading && (isBought || findData?.is_bought) && courseId && findData) {
      navigate(`/kurslar/${slug}/${courseId}`, { replace: true });
    }
  }, [isBought, accessLoading, courseId, findData]);

  useEffect(() => {
    if (!courseId) return;
    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const response = await fetch(
          `https://myrobo.uz/api/courses/courses/${courseId}/sections/`,
          { headers: { "Content-Type": "application/json" } }
        );
        const result = await response.json();
        setSections(result);
        result.forEach(async (section) => {
          try {
            const topicsRes = await fetch(
              `https://myrobo.uz/api/courses/sections/${section.id}/topics/`,
              { headers: { "Content-Type": "application/json" } }
            );
            const topics = await topicsRes.json();
            setTopicsMap((prev) => ({ ...prev, [section.id]: topics }));
          } catch (err) {}
        });
      } catch (err) {
      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, [courseId]);

  const openOfertaModal = () => setShowOfertaModal(true);
  const handleOfertaClose = () => setShowOfertaModal(false);

  const handleAgreeTerms = (e) => {
    const checked = e.target.checked;
    if (checked && !hasReadOferta) {
      openOfertaModal();
      setAgreeToTerms(false);
    } else {
      setAgreeToTerms(checked);
    }
  };

  const handleOfertaRead = () => {
    setHasReadOferta(true);
    setAgreeToTerms(true);
    setShowOfertaModal(false);
  };

  const buyCourse = async () => {
    if (!token) {
      notify({ type: "token" });
      navigate("/login/");
      return;
    }
    if (!agreeToTerms || !hasReadOferta) {
      notification.warning({
        message: "Iltimos, ommaviy oferta shartnomasi bilan tanishing va rozilik bering",
      });
      return;
    }
    try {
      const response = await fetch("https://myrobo.uz/api/courses/courses/buy/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (response.ok) {
        notification.success({ message: "Kurs muvaffaqiyatli sotib olindi!" });
        navigate(`/kurslar/${slug}/${courseId}`);
      } else {
        let errorMessage = "Xatolik yuz berdi";
        try {
          const responseText = await response.text();
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              if (errorData.detail) errorMessage = errorData.detail;
            } catch {
              errorMessage = responseText;
            }
          }
        } catch {}
        notification.error({ message: errorMessage });
        if (response.status === 402) {
          navigate("/subscription", { state: { courseData: findData } });
        }
      }
    } catch (err) {
      notification.error({ message: "Soʻrov yuborishda xatolik" });
    }
  };

  /* ────── Loading skeleton ────── */
  if (pageLoading || accessLoading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-950 min-h-screen font-sans transition-colors duration-300">
        <div className="w-full md:w-[90%] m-auto px-3 md:px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="h-8 md:h-10 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-48 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md space-y-3">
                <div className="h-5 md:h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 md:h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 md:h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-40 md:h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
                <div className="p-4 md:p-6 space-y-4">
                  <div className="h-5 md:h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                  <div className="h-10 md:h-12 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ────── Kurs topilmadi ────── */
  if (!findData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950 transition-colors duration-300">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">Kurs topilmadi</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Bosh sahifaga qaytish
          </button>
        </div>
      </div>
    );
  }

  const fullUrl = `https://myrobo.uz/kurslar/${slug}`;

  return (
    <>
      <Helmet>
        <title>{findData?.title} | MyRobo.uz</title>
        <meta
          name="description"
          content={findData?.about?.slice(0, 155) || "MyRobo platformasidagi kurs haqida ma'lumot."}
        />
        <meta property="og:title" content={findData?.title} />
        <meta
          property="og:description"
          content={findData?.about?.slice(0, 155) || "MyRobo platformasidagi kurs haqida ma'lumot."}
        />
        <meta property="og:image" content={findData?.image} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Oferta Modal */}
      <Modal
        title="Ommaviy Oferta Shartnomasi"
        className="h-full sm:h-auto top-0 sm:top-auto sm:my-8"
        open={showOfertaModal}
        width={"100%"}
        onCancel={handleOfertaClose}
        style={{ maxHeight: "90vh" }}
        bodyStyle={{ maxHeight: "calc(90vh - 120px)", overflowY: "auto" }}
        footer={[
          <button
            key="close"
            onClick={handleOfertaClose}
            className="bg-gray-400 m-1 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-full sm:w-auto"
          >
            Yopish
          </button>,
          <button
            key="agree"
            onClick={handleOfertaRead}
            className="bg-blue-600 m-1 sm:w-auto hover:bg-blue-700 w-full text-white px-6 py-2 rounded-md"
          >
            Men tanishib chiqdim va rozilik beraman
          </button>,
        ]}
      >
        <div style={{ maxHeight: "calc(90vh - 200px)", overflowY: "auto" }}>
          <SubscriptionOferta />
        </div>
      </Modal>

      {/* Asosiy sahifa */}
      <div className="bg-gray-100 dark:bg-gray-950 min-h-screen font-sans transition-colors duration-300">
        <div className="w-full md:w-[90%] m-auto px-3 md:px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">

            {/* ── Chap ustun ── */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span className="text-blue-600 line-clamp-2">{findData?.title}</span>
              </h1>

              {/* Kurs rasmi */}
              <div className="bg-white dark:bg-gray-800 backdrop-blur-sm rounded-lg overflow-hidden p-2 md:p-4 shadow-lg border border-transparent dark:border-gray-700">
                <img
                  src={findData?.image}
                  className="w-full h-auto max-h-64 md:max-h-60 object-contain mx-auto rounded-md"
                  alt={findData?.title}
                  loading="lazy"
                />
              </div>

              {/* Tavsif */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md border border-transparent dark:border-gray-700">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900 dark:text-white">
                  Tavsif
                </h2>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                  {findData?.about}
                </p>
              </div>

              {/* Statistika */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md border border-transparent dark:border-gray-700">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 text-gray-900 dark:text-white">
                  Kurs statistikasi
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                  <span className="flex items-center gap-2">
                    <BarsOutlined />
                    <span>Bo'limlar: <strong className="text-gray-900 dark:text-white">{findData?.sections_count}</strong></span>
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOutlined />
                    <span>Mavzular: <strong className="text-gray-900 dark:text-white">{findData?.topics_count}</strong></span>
                  </span>
                  <span className="flex items-center gap-2">
                    <UserSwitchOutlined />
                    <span>O'quvchilar: <strong className="text-gray-900 dark:text-white">{findData?.buyers_total}</strong></span>
                  </span>
                </div>
              </div>

              {/* Bo'limlar */}
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Kurs bo'limlari
                </h2>
                {loadingSections ? (
                  <div className="flex items-center gap-2 text-blue-500 text-sm md:text-base">
                    <LoadingOutlined /> Yuklanmoqda...
                  </div>
                ) : sections.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base">
                    Bo'limlar mavjud emas.
                  </p>
                ) : (
                  sections.map((section) => (
                    <div key={section.id}>
                      {/* Bo'lim sarlavhasi */}
                      <div className="bg-blue-900 dark:bg-blue-800 text-white p-3 md:p-4 rounded-t-lg">
                        <h3 className="font-medium text-sm md:text-base truncate">
                          {section.title}
                        </h3>
                      </div>

                      {/* Mavzular */}
                      <div className="bg-white dark:bg-gray-800 shadow-md rounded-b-lg divide-y divide-gray-100 dark:divide-gray-700">
                        {topicsMap[section.id] ? (
                          topicsMap[section.id].map((topic) => (
                            <div
                              key={topic.id}
                              className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between
                                         hover:bg-gray-50 dark:hover:bg-gray-700 gap-2 sm:gap-0 transition-colors"
                            >
                              <div className="flex items-start sm:items-center gap-2 min-w-0">
                                {topic.topic_type === "video" ? (
                                  <PlayCircleOutlined className="text-blue-500 flex-shrink-0 mt-1 sm:mt-0" />
                                ) : (
                                  <CodeOutlined className="text-green-500 flex-shrink-0 mt-1 sm:mt-0" />
                                )}
                                <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm truncate">
                                  {topic.title}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap">
                                {topic.topic_type === "video" ? "Video" : "Kod"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 md:p-4 text-gray-400 dark:text-gray-500 text-xs md:text-sm">
                            <LoadingOutlined className="mr-2" /> Mavzular yuklanmoqda...
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── O'ng ustun – Sotib olish kartasi ── */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-transparent dark:border-gray-700 overflow-hidden sticky top-4 lg:top-20">
                <img
                  src={findData?.image}
                  className="w-full h-40 md:h-48 lg:h-56 object-contain mx-auto rounded-md"
                  alt={findData?.title}
                  loading="lazy"
                />
                <div className="p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 line-clamp-2 text-gray-900 dark:text-white">
                    {findData?.title}
                  </h2>

                  <div className="border-t border-b border-gray-200 dark:border-gray-700 py-3 md:py-4 my-3 md:my-4">
                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">Kurs narxi:</p>
                    <div className="flex items-center mt-1 md:mt-2">
                      <span className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                        {findData?.price === 0 ||
                        findData?.price === "0" ||
                        !findData?.price
                          ? "Bepul"
                          : `${Number(findData?.price).toLocaleString("uz-UZ")} so'm`}
                      </span>
                    </div>
                  </div>

                  {/* Checkbox – Desktop */}
                  <label className="hidden sm:flex items-start gap-3 cursor-pointer group mb-4 p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={handleAgreeTerms}
                      className="w-5 h-5 mt-1 cursor-pointer accent-blue-600 flex-shrink-0 rounded border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all"
                    />
                    <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm leading-relaxed">
                      Men{" "}
                      <button
                        onClick={openOfertaModal}
                        className="text-blue-600 underline font-semibold hover:text-blue-700"
                      >
                        ommaviy oferta shartnomasi
                      </button>{" "}
                      bilan tanishib chiqdim va rozilik beraman
                    </span>
                  </label>

                  {/* Checkbox – Mobile */}
                  <div className="mb-4 rounded-xl border sm:hidden border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={handleAgreeTerms}
                        className="w-5 h-5 mt-1 cursor-pointer accent-blue-600 flex-shrink-0 rounded border-2 border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                        Men ommaviy oferta shartnomasi bilan tanishib chiqdim va rozilik beraman
                      </span>
                    </label>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Shartnoma bilan tanishish uchun{" "}
                      <button
                        onClick={openOfertaModal}
                        className="text-blue-600 font-medium underline hover:text-blue-700"
                      >
                        shu yerni bosing
                      </button>
                    </p>
                  </div>

                  {/* Sotib olish tugmasi */}
                  <button
                    onClick={buyCourse}
                    disabled={!agreeToTerms || !hasReadOferta}
                    className={`text-white rounded-md w-full py-2.5 md:py-3 text-sm md:text-base font-medium transition duration-300 shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                      agreeToTerms && hasReadOferta
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Kursga yozilish
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default KirishComponentsID;
