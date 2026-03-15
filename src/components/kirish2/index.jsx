import { useState, useEffect } from "react";
import {
  CodeOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
  CheckCircleFilled,
  BarsOutlined,
  BookOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useData } from "../../datacontect";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import notificationApi from "../../generic/notificition";
import { useCourseAccess } from "../../hooks/useCourseAccess";

function fromSlug(slug) {
  if (!slug || typeof slug !== "string") return "";
  return slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
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
  const [buyLoading, setBuyLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const titleFromSlug = fromSlug(slug);
  const findData = data?.find(
    (item) =>
      item?.title?.trim().toLowerCase() === titleFromSlug?.trim().toLowerCase()
  );
  const courseId = findData?.id;

  // useCourseAccess hook — markazlashtirilgan tekshiruv
  const { isBought, loading: accessLoading, token: tkn } = useCourseAccess(courseId);

  useEffect(() => {
    const load = async () => {
      setPageLoading(true);
      try {
        await fetchCourse();
      } catch (err) {
        console.error("fetchCourse xatolik:", err);
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [slug]);

  const location = useLocation();
  useEffect(() => {
    if (
      location.pathname === "/kirish2/" ||
      location.pathname === "kirish2" ||
      !slug
    ) {
      navigate("/", { replace: true });
    }
  }, [location.pathname]);

  // Kurs sotib olingan bo'lsa — darhol yo'naltir
  useEffect(() => {
    if (!accessLoading && isBought && courseId) {
      navigate("/frontned/", { replace: true });
    }
  }, [isBought, accessLoading, courseId]);

  useEffect(() => {
    if (!courseId) return;
    const fetchSections = async () => {
      setLoadingSections(true);
      try {
        const response = await fetch(
          `https://api.myrobo.uz/courses/courses/${courseId}/sections/`,
          { headers: { "Content-Type": "application/json" } }
        );
        const result = await response.json();
        setSections(result);

        result.forEach(async (section) => {
          try {
            const topicsRes = await fetch(
              `https://api.myrobo.uz/courses/sections/${section.id}/topics/`,
              { headers: { "Content-Type": "application/json" } }
            );
            const topics = await topicsRes.json();
            setTopicsMap((prev) => ({ ...prev, [section.id]: topics }));
          } catch (err) {
            console.error("Topics xatolik:", err);
          }
        });
      } catch (err) {
        console.error("Sections xatolik:", err);
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
    setBuyLoading(true);
    try {
      const response = await fetch("https://api.myrobo.uz/courses/courses/buy/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      const result = await response.json();
      if (response.status === 402) {
        notify({ type: "noMoney", message: result?.detail || "Balans yetarli emas." });
        return;
      }
      if (result?.ok === true) {
        notify({ type: "success" });
        navigate("/frontned/");
      } else {
        notify({ type: "error" });
      }
    } catch (err) {
      console.error("Sotib olish xatoligi:", err);
      notify({ type: "noMoney" });
    } finally {
      setBuyLoading(false);
    }
  };

  if (pageLoading || accessLoading) {
    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <div className="w-[90%] m-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-10 w-2/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
              <div className="bg-white rounded-lg p-6 shadow-md space-y-3">
                <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-64 bg-gray-200 animate-pulse" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
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

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <div className="w-[90%] m-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl md:text-3xl font-semibold flex gap-2">
              Kurs haqida:
              <span className="text-blue-600">{findData?.title}</span>
            </h1>
            <div className="bg-orange-200 rounded-lg overflow-hidden p-6 md:p-10 shadow-lg">
              <img
                src={findData?.image}
                className="w-full object-contain mx-auto"
                alt={findData?.title}
              />
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Tavsif</h2>
              <p className="text-gray-700">{findData?.about}</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Kurs statistikasi</h2>
              <div className="flex gap-6 text-gray-600 text-sm">
                <span>
                  <BarsOutlined /> Bo'limlar:{" "}
                  <strong>{findData?.sections_count}</strong>
                </span>
                <span>
                  <BookOutlined /> Mavzular:{" "}
                  <strong>{findData?.topics_count}</strong>
                </span>
                <span>
                  <UserSwitchOutlined /> O'quvchilar:{" "}
                  <strong>{findData?.buyers_total}</strong>
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Kurs bo'limlari</h2>
              {loadingSections ? (
                <div className="flex items-center gap-2 text-blue-500">
                  <LoadingOutlined /> Yuklanmoqda...
                </div>
              ) : sections.length === 0 ? (
                <p className="text-gray-500">Bo'limlar mavjud emas.</p>
              ) : (
                sections.map((section) => (
                  <div key={section.id}>
                    <div className="bg-blue-900 text-white p-4 rounded-t-lg">
                      <h3 className="font-medium">{section.title}</h3>
                    </div>
                    <div className="bg-white shadow-md rounded-b-lg divide-y">
                      {topicsMap[section.id] ? (
                        topicsMap[section.id].map((topic) => (
                          <div
                            key={topic.id}
                            className="p-4 flex items-center justify-between hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-2">
                              {topic.topic_type === "video" ? (
                                <PlayCircleOutlined className="text-blue-500" />
                              ) : (
                                <CodeOutlined className="text-green-500" />
                              )}
                              <span className="text-gray-700 text-sm">
                                {topic.title}
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                              {topic.topic_type === "video" ? "Video" : "Kod"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-gray-400 text-sm">
                          <LoadingOutlined className="mr-2" /> Mavzular
                          yuklanmoqda...
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <img
                src={findData?.image}
                className="w-full h-64 object-cover"
                alt={findData?.title}
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{findData?.title}</h2>
                <div className="border-t border-b py-4 my-4">
                  <p className="text-sm text-gray-500">Kurs narxi:</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xl font-bold">
                      {`${findData?.price} so'm`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={buyCourse}
                  disabled={buyLoading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md w-full py-3 font-medium transition duration-300 shadow-md flex items-center justify-center gap-2"
                >
                  {buyLoading ? <LoadingOutlined /> : null}
                  Sotib olish
                </button>
                <div className="flex justify-around mt-4">
                  <img
                    src="https://api.logobank.uz/media/logos_png/Uzcard-01.png"
                    alt="Uzcard"
                    className="h-12 w-12 rounded-md object-contain"
                  />
                  <img
                    src="https://humocard.uz/upload/medialibrary/8cf/ia2yatyqt4l0p0d5523erhmx6y0fssxw/HumoPay-Final-002.png"
                    alt="Humo"
                    className="h-12 w-12 rounded-md object-contain"
                  />
                  <img
                    src="https://pr.uz/wp-content/uploads/2024/05/photo_2024-05-14_20-27-31.jpg"
                    alt="Click"
                    className="h-12 w-12 rounded-md object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KirishComponentsID;
