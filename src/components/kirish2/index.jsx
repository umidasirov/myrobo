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

// ✅ YANGI FUNKSIYA: slugdan shortId ajratib oladi
// SABABI: URL da "python-asoslari--b2b9f1c3" bo'ladi
// Bizga kerak: "b2b9f1c3" — shu orqali kursni topamiz
// "--" dan keyin kelgan qism = shortId
function getShortIdFromSlug(slug) {
  if (!slug) return null;
  const parts = slug.split("--");
  return parts[parts.length - 1]; // oxirgi qism = shortId
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
    if (!accessLoading && isBought && courseId && findData) {
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
          } catch (err) {

          }
        });
      } catch (err) {

      } finally {
        setLoadingSections(false);
      }
    };
    fetchSections();
  }, [courseId]);

  const buyCourse = async () => {
    if (!token) {
      notify({ type: "token" });
      navigate("/login/");
      return;
    }
    navigate("/subscription", {
      state: { courseData: findData },
    });
  };

  if (pageLoading || accessLoading) {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <div className="w-full md:w-[90%] m-auto px-3 md:px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="h-8 md:h-10 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-48 md:h-64 bg-gray-200 rounded-lg animate-pulse" />
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-md space-y-3">
                <div className="h-5 md:h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 md:h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-3 md:h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 md:h-48 bg-gray-200 animate-pulse" />
                <div className="p-4 md:p-6 space-y-4">
                  <div className="h-5 md:h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-10 md:h-12 w-full bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!findData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Kurs topilmadi</p>
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
          content={
            findData?.about?.slice(0, 155) ||
            "MyRobo platformasidagi kurs haqida ma'lumot."
          }
        />


        <meta property="og:title" content={findData?.title} />
        <meta
          property="og:description"
          content={
            findData?.about?.slice(0, 155) ||
            "MyRobo platformasidagi kurs haqida ma'lumot."
          }
        />
        <meta property="og:image" content={findData?.image} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="bg-gray-100 min-h-screen font-sans">
        <div className="w-full md:w-[90%] m-auto px-3 md:px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold flex flex-col sm:flex-row gap-1 sm:gap-2">
                <span>Kurs haqida:</span>
                <span className="text-blue-600 line-clamp-2">{findData?.title}</span>
              </h1>
              <div className="bg-white backdrop-blur-sm rounded-lg overflow-hidden p-2 md:p-4 shadow-lg">
                <img
                  src={findData?.image}
                  className="w-full h-auto max-h-64 md:max-h-60 object-contain mx-auto rounded-md"
                  alt={findData?.title}
                  loading="lazy"
                />
              </div>
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Tavsif</h2>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{findData?.about}</p>
              </div>
              <div className="bg-white rounded-lg p-4 md:p-6 shadow-md">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Kurs statistikasi</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 text-gray-600 text-xs md:text-sm">
                  <span className="flex items-center gap-2">
                    <BarsOutlined /> <span>Bo'limlar: <strong>{findData?.sections_count}</strong></span>
                  </span>
                  <span className="flex items-center gap-2">
                    <BookOutlined /> <span>Mavzular: <strong>{findData?.topics_count}</strong></span>
                  </span>
                  <span className="flex items-center gap-2">
                    <UserSwitchOutlined /> <span>O'quvchilar: <strong>{findData?.buyers_total}</strong></span>
                  </span>
                </div>
              </div>
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-lg md:text-xl font-semibold">Kurs bo'limlari</h2>
                {loadingSections ? (
                  <div className="flex items-center gap-2 text-blue-500 text-sm md:text-base">
                    <LoadingOutlined /> Yuklanmoqda...
                  </div>
                ) : sections.length === 0 ? (
                  <p className="text-gray-500 text-sm md:text-base">Bo'limlar mavjud emas.</p>
                ) : (
                  sections.map((section) => (
                    <div key={section.id}>
                      <div className="bg-blue-900 text-white p-3 md:p-4 rounded-t-lg">
                        <h3 className="font-medium text-sm md:text-base truncate">{section.title}</h3>
                      </div>
                      <div className="bg-white shadow-md rounded-b-lg divide-y">
                        {topicsMap[section.id] ? (
                          topicsMap[section.id].map((topic) => (
                            <div
                              key={topic.id}
                              className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 gap-2 sm:gap-0"
                            >
                              <div className="flex items-start sm:items-center gap-2 min-w-0">
                                {topic.topic_type === "video" ? (
                                  <PlayCircleOutlined className="text-blue-500 flex-shrink-0 mt-1 sm:mt-0" />
                                ) : (
                                  <CodeOutlined className="text-green-500 flex-shrink-0 mt-1 sm:mt-0" />
                                )}
                                <span className="text-gray-700 text-xs md:text-sm truncate">
                                  {topic.title}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                                {topic.topic_type === "video" ? "Video" : "Kod"}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 md:p-4 text-gray-400 text-xs md:text-sm">
                            <LoadingOutlined className="mr-2" /> Mavzular yuklanmoqda...
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4 lg:top-20">
                <img
                  src={findData?.image}
                  className="w-full h-40 md:h-48 lg:h-56 object-cover"
                  alt={findData?.title}
                  loading="lazy"
                />
                <div className="p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-3 line-clamp-2">
                    {findData?.title}
                  </h2>
                  <div className="border-t border-b py-3 md:py-4 my-3 md:my-4">
                    <p className="text-xs md:text-sm text-gray-500">Kurs narxi:</p>
                    <div className="flex items-center mt-1 md:mt-2">
                      <span className="text-lg md:text-xl font-bold text-gray-900">
                        {findData?.price === 0 ||
                          findData?.price === "0" ||
                          !findData?.price
                          ? "Bepul"
                          : `${Number(findData?.price).toLocaleString(
                            "uz-UZ"
                          )} so'm`}
                      </span>
                    </div>
                  </div>
                  <label className="hidden sm:flex items-start gap-3 cursor-pointer group mb-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-5 h-5 mt-1 cursor-pointer accent-blue-600 flex-shrink-0 rounded border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <span className="text-gray-700 text-xs md:text-sm leading-relaxed">
                      Men{" "}
                      <a
                        href="/subscription"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-semibold"
                      >
                        ommaviy oferta shartnomasi
                      </a>
                      {" "}bilan tanishib chiqdim va rozilik beraman
                    </span>
                  </label>
                  <div className="mb-4 rounded-xl border sm:hidden border-gray-200 p-3 bg-gray-50">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeToTerms}
                        onChange={(e) => setAgreeToTerms(e.target.checked)}
                        className="w-5 h-5 mt-1 cursor-pointer accent-blue-600 flex-shrink-0 rounded border-2 border-gray-300"
                      />
                      <span className="text-gray-700 text-xs leading-relaxed">
                        Men ommaviy oferta shartnomasi bilan tanishib chiqdim va rozilik beraman
                      </span>
                    </label>

                    <p className="mt-2 text-xs text-gray-500">
                      Shartnoma bilan tanishish uchun{" "}
                      <a
                        href="/subscription"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 font-medium underline"
                      >
                        shu yerni bosing
                      </a>
                    </p>
                  </div>
                  <button
                    onClick={buyCourse}
                    disabled={!agreeToTerms}
                    className={`text-white rounded-md w-full py-2.5 md:py-3 text-sm md:text-base font-medium transition duration-300 shadow-md flex items-center justify-center gap-2 active:scale-95 ${agreeToTerms
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-400 cursor-not-allowed"
                      }`}
                  >
                    Obuna bo'lish
                  </button>
                  {/* <div className="flex justify-around mt-4 gap-2">
                    <img
                      src="https://api.logobank.uz/media/logos_png/Uzcard-01.png"
                      alt="Uzcard"
                      className="h-10 md:h-12 w-10 md:w-12 rounded-md object-contain"
                      loading="lazy"
                    />
                    <img
                      src="https://humocard.uz/upload/medialibrary/8cf/ia2yatyqt4l0p0d5523erhmx6y0fssxw/HumoPay-Final-002.png"
                      alt="Humo"
                      className="h-10 md:h-12 w-10 md:w-12 rounded-md object-contain"
                      loading="lazy"
                    />
                    <img
                      src="https://pr.uz/wp-content/uploads/2024/05/photo_2024-05-14_20-27-31.jpg"
                      alt="Click"
                      className="h-10 md:h-12 w-10 md:w-12 rounded-md object-contain"
                      loading="lazy"
                    />
                  </div> */}
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
