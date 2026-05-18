import { useState, useEffect, useRef } from "react";
import {
  CodeOutlined,
  PlayCircleOutlined,
  LoadingOutlined,
  BarsOutlined,
  BookOutlined,
  UserSwitchOutlined,
  CheckCircleOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useData } from "../../datacontect";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import notificationApi from "../../generic/notificition";
import { Helmet } from "react-helmet-async";
import { notification, Modal, Progress } from "antd";
import SubscriptionOferta from "../subscription";

const BASE_URL = "https://myrobo.adxamov.uz";

// Rasm URL ni to'liq qilish (relative → absolute)
const resolveImage = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
};

/* ─── Accordion panel ──────────────────────────────────────────────────────── */
function AccordionPanel({ isOpen, children }) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    setHeight(isOpen ? ref.current.scrollHeight : 0);
  }, [isOpen, children]);

  return (
    <div
      style={{
        height,
        overflow: "hidden",
        transition: "height 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

/* ─── Loading Skeleton ─────────────────────────────────────────────────────── */
function Skeleton() {
  return (
    <div className="bg-gray-100 dark:bg-gray-950 min-h-screen font-sans transition-colors duration-300">
      <div className="w-full md:w-[90%] m-auto px-3 md:px-4 py-4 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="h-8 md:h-10 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-48 md:h-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md space-y-3">
              <div className="h-5 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-40 md:h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-4 md:p-6 space-y-4">
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── KirishComponentsID ───────────────────────────────────────────────────── */
function KirishComponentsID() {
  const { fetchCourseDetail, toPament } = useData();
  const { slug } = useParams();
  const notify = notificationApi();
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [courseDetail, setCourseDetail] = useState(null);
  const [modules, setModules] = useState([]);
  const [pickedModule, setPickedModule] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [courseProgress, setCourseProgress] = useState(0);

  // Oferta
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [hasReadOferta, setHasReadOferta] = useState(false);
  const [showOfertaModal, setShowOfertaModal] = useState(false);

  // To'lov
  const [buying, setBuying] = useState(false);

  // ── Yo'naltirish xatosi ──────────────────────────────────────────────────
  useEffect(() => {
    if (location.pathname === "/kurslar/" || !slug) {
      navigate("/", { replace: true });
    }
  }, [location.pathname, slug, navigate]);

  // ── Kurs ma'lumotlarini yuklash ──────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setPageLoading(true);
      try {
        const detail = await fetchCourseDetail(slug);
        if (!detail) return;

        setCourseDetail(detail);
        setModules(detail.modules ?? []);
        setIsSubscribed(detail.is_subscribed ?? false);
        setCourseProgress(detail.progress ?? 0);

        // Birinchi modulni avtomatik ochish
        if (detail.modules?.length > 0) {
          setPickedModule(detail.modules[0].id);
        }
      } catch (err) {
        console.error("Kurs yuklanmadi:", err);
        notification.error({ message: "Kurs ma'lumotlarini yuklab bo'lmadi" });
      } finally {
        setPageLoading(false);
      }
    };
    load();
  }, [slug]);

  // ── Auto-navigate: tuzatilgan va xavfsiz holat ───────────────────────────
  useEffect(() => {
    if (!courseDetail || !token) return;
    if (!isSubscribed) return;

    const firstModule = courseDetail.modules?.[0];
    const firstLesson = firstModule?.lessons?.[0];

    if (!firstModule) return;

    const courseId = firstModule.id;
    const lastTopicId = localStorage.getItem(`last_topic_${courseId}`);
    
    if (lastTopicId) {
      navigate(`/kurslar/${slug}/${courseId}/${lastTopicId}`, { replace: true });
    } else {
      const lessonSlug = firstLesson?.slug || "yuilya";
      navigate(`/kurslar/${slug}/${courseId}/${lessonSlug}`, { replace: true });
    }
  }, [courseDetail, isSubscribed, token, slug, navigate]);

  // ── Balans to'ldirish (fallback) ─────────────────────────────────────────
  const addBalance = async (amount) => {
    if (!token) { navigate("/login"); return; }
    try {
      const res = await fetch(`${BASE_URL}/payment/checkout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (res.ok) window.open(data.payment_url, "_blank");
      else
        notification.error({
          message: data?.message || data?.detail || "Balansni to'ldirishda xatolik",
        });
    } catch {
      notification.error({ message: "Server bilan bog'lanib bo'lmadi" });
    }
  };

  // ── Oferta ──────────────────────────────────────────────────────────────
  const handleAgreeTerms = (e) => {
    if (e.target.checked && !hasReadOferta) {
      setShowOfertaModal(true);
      setAgreeToTerms(false);
    } else {
      setAgreeToTerms(e.target.checked);
    }
  };

  const handleOfertaRead = () => {
    setHasReadOferta(true);
    setAgreeToTerms(true);
    setShowOfertaModal(false);
  };

  // ── Kurs sotib olish ─────────────────────────────────────────────────────
  const buyCourse = async () => {
    if (!token) { notify({ type: "token" }); navigate("/login/"); return; }
    if (!agreeToTerms || !hasReadOferta) {
      notification.warning({
        message: "Iltimos, ommaviy oferta bilan tanishing va rozilik bering",
      });
      return;
    }

    setBuying(true);
    try {
      const response = await toPament(slug, null, "course");

      if (response?.payment_url) {
        window.open(response.payment_url, "_blank");
        notification.info({ message: "To'lov sahifasiga yo'naltirilmoqda" });
      } else if (response?.status === "success") {
        notification.success({ message: "Kurs muvaffaqiyatli sotib olindi!" });
        const updated = await fetchCourseDetail(slug);
        if (updated) {
          setCourseDetail(updated);
          setModules(updated.modules ?? []);
          setIsSubscribed(updated.is_subscribed ?? false);
          setCourseProgress(updated.progress ?? 0);
        }
      } else {
        notification.error({ message: "Xatolik yuz berdi" });
        addBalance(courseDetail?.price ?? 200000);
      }
    } catch {
      notification.error({ message: "So'rov yuborishda xatolik" });
      addBalance(courseDetail?.price ?? 200000);
    } finally {
      setBuying(false);
    }
  };

  const continueCourse = () => {
    if (isSubscribed) navigate(`/kurslar/${slug}/dashboard`);
  };

  const totalLessons = modules.reduce(
    (acc, m) =>
      acc + (m.lessons?.length > 0 ? m.lessons.length : (m.lessons_count ?? 0)),
    0
  );

  const isFree =
    !courseDetail?.price ||
    courseDetail.price === "0" ||
    courseDetail.price === "0.00" ||
    Number(courseDetail.price) === 0;

  const fullUrl = `${BASE_URL}/kurslar/${slug}`;

  if (pageLoading) return <Skeleton />;

  if (!courseDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
            Kurs topilmadi
          </p>
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
    <>
      <Helmet>
        <title>{courseDetail.title} | MyRobo.uz</title>
        <meta
          name="description"
          content={courseDetail.description?.slice(0, 155) ?? "MyRobo platformasidagi kurs."}
        />
        <meta property="og:title" content={courseDetail.title} />
        <meta
          property="og:description"
          content={courseDetail.description?.slice(0, 155) ?? ""}
        />
        <meta property="og:image" content={resolveImage(courseDetail.image)} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ── Oferta Modal ── */}
      <Modal
        title="Ommaviy Oferta Shartnomasi"
        open={showOfertaModal}
        width="90%"
        onCancel={() => setShowOfertaModal(false)}
        style={{ maxHeight: "90vh" }}
        styles={{ body: { maxHeight: "calc(90vh - 120px)", overflowY: "auto" } }}
        className="
          dark:[&_.ant-modal-content]:!bg-gray-800
          dark:[&_.ant-modal-header]:!bg-gray-800
          dark:[&_.ant-modal-title]:!text-white
          dark:[&_.ant-modal-footer]:!bg-gray-800
        "
        footer={[
          <button
            key="close"
            onClick={() => setShowOfertaModal(false)}
            className="bg-gray-400 m-1 hover:bg-gray-500 text-white px-6 py-2 rounded-md w-full sm:w-auto dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Yopish
          </button>,
          <button
            key="agree"
            onClick={handleOfertaRead}
            className="bg-blue-600 m-1 hover:bg-blue-700 w-full sm:w-auto text-white px-6 py-2 rounded-md"
          >
            Tanishib chiqdim va rozilik beraman
          </button>,
        ]}
      >
        <div className="dark:text-gray-200">
          <SubscriptionOferta />
        </div>
      </Modal>

      {/* ── Sahifa ── */}
      <div className="bg-gray-100 dark:bg-gray-950 min-h-screen font-sans transition-colors duration-300">
        <div className="w-full md:w-[90%] m-auto px-3 md:px-4 py-4 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">

            {/* ══════ CHAP USTUN ══════ */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div>
                <span className="text-xs font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-full capitalize">
                  {courseDetail.course_type?.title}
                </span>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-white mt-2 capitalize">
                  {courseDetail.title}
                </h1>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden p-3 md:p-4 shadow-lg border border-gray-100 dark:border-gray-700">
                <img
                  src={resolveImage(courseDetail.image)}
                  className="w-full h-auto max-h-72 object-contain mx-auto rounded-md"
                  alt={courseDetail.title}
                  loading="lazy"
                />
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  Kurs haqida
                </h2>
                <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                  {courseDetail.description || "Tavsif mavjud emas"}
                </p>
              </div>

              {courseDetail.teachers?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md border border-gray-100 dark:border-gray-700">
                  <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                    O'qituvchilar
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {courseDetail.teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        onClick={() => navigate(`/mentorlar/${teacher.slug}`)}
                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-xl transition-colors"
                      >
                        <img
                          src={resolveImage(teacher.image)}
                          alt={teacher.full_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-100 dark:border-blue-800"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.full_name)}&background=3b82f6&color=fff`;
                          }}
                        />
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-white">
                            {teacher.full_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {teacher.job || "Mentor"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-md border border-gray-100 dark:border-gray-700">
                <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-900 dark:text-white">
                  Kurs statistikasi
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-gray-600 dark:text-gray-400 text-xs md:text-sm">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <BarsOutlined className="text-blue-500 text-base" />
                    <span>
                      Bo'limlar:{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {modules.length}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <BookOutlined className="text-green-500 text-base" />
                    <span>
                      Mavzular:{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {totalLessons}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <UserSwitchOutlined className="text-purple-500 text-base" />
                    <span>
                      O'qituvchilar:{" "}
                      <strong className="text-gray-900 dark:text-white">
                        {courseDetail.teachers?.length ?? 0}
                      </strong>
                    </span>
                  </div>
                </div>

                {isSubscribed && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Yakunlanish darajasi
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {Math.round(courseProgress)}%
                      </span>
                    </div>
                    <Progress
                      percent={Math.round(courseProgress)}
                      strokeColor="#3b82f6"
                      showInfo={false}
                      size="small"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
                  Kurs bo'limlari
                </h2>

                {modules.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Bo'limlar mavjud emas.
                  </p>
                ) : (
                  modules.map((module) => {
                    const isOpen = module.id === pickedModule;
                    const lessons = module.lessons ?? [];
                    const lessonsCount =
                      lessons.length > 0 ? lessons.length : (module.lessons_count ?? 0);

                    return (
                      <div key={module.id} className="rounded-lg overflow-hidden shadow-sm">
                        <div
                          onClick={() => setPickedModule(isOpen ? null : module.id)}
                          className="bg-blue-900 dark:bg-blue-800 text-white p-3 md:p-4 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="font-medium text-sm md:text-base truncate">
                              {module.title}
                            </h3>
                            <span className="flex-shrink-0 text-xs bg-blue-700 dark:bg-blue-600 px-2 py-0.5 rounded-full">
                              {lessonsCount} dars
                            </span>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              width: 16,
                              height: 16,
                              flexShrink: 0,
                              marginLeft: 8,
                              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                              transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
                            }}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </div>

                        <AccordionPanel isOpen={isOpen}>
                          <div className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
                            {lessons.length === 0 ? (
                              <div className="p-4 flex items-center gap-3 text-gray-400 dark:text-gray-500">
                                <LockOutlined />
                                <span className="text-sm">
                                  {isSubscribed
                                    ? "Darslar yuklanmoqda..."
                                    : `${lessonsCount} ta dars mavjud — kursga yoziling`}
                                </span>
                              </div>
                            ) : (
                              lessons.map((lesson, idx) => (
                                <div
                                  key={lesson.id}
                                  className="p-3 md:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between
                                             hover:bg-gray-50 dark:hover:bg-gray-700/50 gap-2 transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <span className="text-gray-400 text-xs w-5 flex-shrink-0">
                                      {idx + 1}
                                    </span>
                                    {lesson.lesson_type === "video" ? (
                                      <PlayCircleOutlined className="text-blue-500 flex-shrink-0" />
                                    ) : (
                                      <CodeOutlined className="text-green-500 flex-shrink-0" />
                                    )}
                                    <span className="text-gray-700 dark:text-gray-300 text-xs md:text-sm truncate">
                                      {lesson.title}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 ml-7 sm:ml-0 flex-shrink-0">
                                    <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                                      {lesson.lesson_type === "video"
                                        ? "Video"
                                        : "Amaliyot"}
                                    </span>
                                    {isSubscribed && lesson.is_completed && (
                                      <CheckCircleOutlined className="text-green-500 text-sm" />
                                    )}
                                    {!isSubscribed && (
                                      <LockOutlined className="text-gray-400 text-xs" />
                                    )}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </AccordionPanel>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* ══════ O'NG USTUN — sotib olish kartasi ══════ */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-4 lg:top-20">
                <img
                  src={resolveImage(courseDetail.image)}
                  className="w-full h-44 md:h-52 object-contain bg-gray-50 dark:bg-gray-700 p-2"
                  alt={courseDetail.title}
                  loading="lazy"
                />

                <div className="p-4 md:p-6 space-y-4">
                  <h2 className="text-base md:text-lg font-semibold line-clamp-2 text-gray-900 dark:text-white capitalize">
                    {courseDetail.title}
                  </h2>

                  <div className="border-t border-b border-gray-200 dark:border-gray-700 py-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {isSubscribed ? "Kurs holati" : "Kurs narxi"}
                    </p>
                    {isSubscribed ? (
                      <div className="space-y-1">
                        <span className="text-green-600 dark:text-green-400 font-semibold text-sm flex items-center gap-1">
                          <CheckCircleOutlined /> Sotib olingan
                        </span>
                        {courseProgress > 0 && (
                          <>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                              <span>Yakunlanish</span>
                              <span>{Math.round(courseProgress)}%</span>
                            </div>
                            <Progress
                              percent={Math.round(courseProgress)}
                              strokeColor="#3b82f6"
                              showInfo={false}
                              size="small"
                            />
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {isFree
                          ? "Bepul"
                          : `${Number(courseDetail.price).toLocaleString("uz-UZ")} so'm`}
                      </span>
                    )}
                  </div>

                  {isSubscribed ? (
                    <button
                      onClick={continueCourse}
                      className="bg-green-600 hover:bg-green-700 text-white rounded-md w-full py-2.5 text-sm font-medium transition duration-300 flex items-center justify-center gap-2"
                    >
                      <PlayCircleOutlined />
                      Kursni davom ettirish
                    </button>
                  ) : (
                    <>
                      <label className="hidden sm:flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                        <input
                          type="checkbox"
                          checked={agreeToTerms}
                          onChange={handleAgreeTerms}
                          className="w-4 h-4 mt-0.5 cursor-pointer accent-blue-600 flex-shrink-0"
                        />
                        <span className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                          Men{" "}
                          <button
                            onClick={() => setShowOfertaModal(true)}
                            className="text-blue-600 underline font-semibold hover:text-blue-700"
                          >
                            ommaviy oferta
                          </button>{" "}
                          bilan tanishdim va roziman
                        </span>
                      </label>

                      <div className="sm:hidden rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-gray-50 dark:bg-gray-900">
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={agreeToTerms}
                            onChange={handleAgreeTerms}
                            className="w-4 h-4 mt-0.5 cursor-pointer accent-blue-600 flex-shrink-0"
                          />
                          <span className="text-gray-700 dark:text-gray-300 text-xs leading-relaxed">
                            Ommaviy oferta bilan tanishdim va roziman
                          </span>
                        </label>
                        <button
                          onClick={() => setShowOfertaModal(true)}
                          className="mt-2 text-xs text-blue-600 font-medium underline hover:text-blue-700"
                        >
                          Ofertani o'qish →
                        </button>
                      </div>

                      <button
                        onClick={buyCourse}
                        disabled={!agreeToTerms || !hasReadOferta || buying}
                        className={`text-white rounded-md w-full py-3 text-sm font-medium transition duration-300 shadow-md flex items-center justify-center gap-2 active:scale-95 ${
                          agreeToTerms && hasReadOferta && !buying
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                        }`}
                      >
                        {buying && <LoadingOutlined />}
                        {isFree ? "Bepul boshlash" : "Kursga yozilish"}
                      </button>
                    </>
                  )}
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