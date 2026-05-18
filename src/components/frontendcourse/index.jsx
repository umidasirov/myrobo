import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { Button } from "antd";
import {
  PlayCircleFilled,
  BookFilled,
  CheckCircleFilled,
  CodeOutlined,
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useData } from "../../datacontect";
import CodeEditor from "../codeEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useCourseAccess } from "../../hooks/useCourseAccess";
import { Helmet } from "react-helmet-async";
import KinescopePlayer from "@kinescope/react-kinescope-player";
import { ShieldQuestionMark } from "lucide-react";

// FIX 1: BASE_URL environment variable dan olinadi, lekin yo'q bo'lsa default URL ishlatiladi
const BASE_URL = import.meta.env.VITE_API_URL || "https://myrobo.adxamov.uz";

// FIX 2: Token helper — har doim yangi qiymat o'qiydi (closure stale bo'lmaydi)
const getToken = () => localStorage.getItem("token");

// FIX 3: Barcha fetch uchun yagona helper — token majburiy yoki ixtiyoriy
const apiFetch = async (
  url,
  {
    method = "GET",
    body = null,
    requireAuth = false,
    headers: customHeaders = {},
  } = {}
) => {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else if (requireAuth) {
    throw new Error("Autentifikatsiya talab qilinadi");
  }

  const res = await fetch(url, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    throw new Error(`HTTP xato: ${res.status}`);
  }

  return res.json();
};

// FIX 4: ID larni har doim string ga normalize qilamiz (string vs number type mismatch)
const toStr = (id) => (id === null || id === undefined ? null : String(id));

const normalizeCourseData = (course) => ({
  ...course,
  progress_percentage: Number(
    course.progress ?? course.progress_percentage ?? 0
  ),
  about: course.about ?? course.description ?? "",
  description: course.description ?? course.about ?? "",
});

const buildSectionMap = (courseDetail) => {
  const modules = Array.isArray(courseDetail.modules)
    ? courseDetail.modules
    : [];

  const safeSections = modules.map((module) => ({
    ...module,
    lessons: Array.isArray(module.lessons) ? module.lessons : [],
  }));

  const topicsMap = safeSections.reduce((acc, section) => {
    if (section.lessons.length > 0) {
      acc[section.id] = section.lessons;
    }
    return acc;
  }, {});

  return { sections: safeSections, topicsMap };
};

/* ─────────────── UI helpers ─────────────── */
function Skeleton({ className = "", style }) {
  return (
    <div
      className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`}
      style={style}
    />
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-9 w-full rounded" />
          {i <= 2 && (
            <div className="ml-6 space-y-1">
              <Skeleton className="h-7 w-5/6 rounded" />
              <Skeleton className="h-7 w-4/6 rounded" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="mb-6 shadow bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-lg p-6 border border-transparent dark:border-gray-700">
      <div className="space-y-4">
        <Skeleton className="h-7 w-1/2 rounded" />
        <Skeleton className="w-full rounded-lg" style={{ height: "400px" }} />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
      </div>
    </div>
  );
}

function EmptySections() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-blue-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <div>
        <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
          Darslar hali qo'shilmagan
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 leading-relaxed">
          Kurs tayyorlanmoqda.
          <br />
          Tez orada darslar joylashtiriladi!
        </p>
      </div>
    </div>
  );
}


function KinescopeWithLoader({ videoId, token, startFrom = 0, onEnded, onTimeUpdate }) {
  const [ready, setReady] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    setReady(false);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [videoId]);

  const handleReady = useCallback((data) => {
    // kichik delay — iframe render tugashi uchun
    timeoutRef.current = setTimeout(() => {
      setReady(true);
    }, 700);
  }, []);

  return (
    <div className="relative w-full h-full bg-[#1E1E1E] rounded-lg overflow-hidden">
      {!ready && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1E1E1E]">
          <LoadingOutlined
            spin
            style={{
              fontSize: 42,
              color: "#60a5fa",
            }}
          />
          <span className="ml-2 text-white">
            Dasr yuklanmoqda...
          </span>
        </div>
      )}
     

      <KinescopePlayer
        videoId={videoId}
        drmAuthToken={token}
        title=""
        language="en"
        startFrom={startFrom}
        onInit={handleReady}
        width="100%"
        height="100%"
        controls
        onReady={handleReady}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onError={(e) => {
          console.error("Kinescope error:", e);
        }}
      />
    </div>
  );
}

function ErrorBanner({ message, onRetry }) {
  return (
    <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center justify-between gap-3">
      <p className="text-red-700 dark:text-red-400 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex-shrink-0 text-xs font-medium text-red-600 dark:text-red-400 underline hover:no-underline"
        >
          Qayta urinish
        </button>
      )}
    </div>
  );
}

const FrontendCourse = () => {
  const { data, fetchCourse, fetchCourseDetail } = useData();
  const { slug, courseId: id, topicId: urlTopicId } = useParams();
  const navigate = useNavigate();
  const { isBought, loading: accessLoading } = useCourseAccess(id);

  // FIX 4 (davomi): lastTopicId ni section ID sifatida emas, faqat reference sifatida saqlaymiz
  // Endi u expandedSection uchun ishlatilmaydi (type mismatch muammosini bartaraf etdi)
  const lastSectionId = localStorage.getItem("last_section_id");

  /* ── State ── */
  const [courseData, setCourseData] = useState(null);
  const [sections, setSections] = useState([]);
  const [topicsMap, setTopicsMap] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicDetail, setTopicDetail] = useState(null);

  // FIX 7: expandedSection — endi to'g'ri section ID bilan boshlanadi
  const [expandedSection, setExpandedSection] = useState(lastSectionId ?? null);

  const [pageLoading, setPageLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [topicLoading, setTopicLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [code, setCode] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // FIX 6 (davomi): xato holatlari
  const [sectionsError, setSectionsError] = useState(null);
  const [topicError, setTopicError] = useState(null);

  /* ──────────────────────────────────────── */
  /* Memoized calculations                    */
  /* ──────────────────────────────────────── */

  const allTopicsFlat = useMemo(() => {
    return sections.flatMap((sec) => topicsMap[sec.id] || []);
  }, [sections, topicsMap]);

  const currentIndex = useMemo(() => {
    return allTopicsFlat.findIndex(
      (t) => toStr(t.id) === toStr(selectedTopic?.id)
    );
  }, [allTopicsFlat, selectedTopic?.id]);

  const isFirst = useMemo(() => currentIndex <= 0, [currentIndex]);
  const isLast = useMemo(
    () => currentIndex >= allTopicsFlat.length - 1,
    [currentIndex, allTopicsFlat.length]
  );

  // Yangi API: tasks[0], video_url to'g'ridan Kinescope ID (OTP shart emas)
  const problem = useMemo(() => topicDetail?.tasks?.[0] ?? null, [topicDetail]);
  const videoId = useMemo(() => topicDetail?.video_url ?? null, [topicDetail]);
  const videoToken = null;

  /* ──────────────────────────────────────── */
  /* Callbacks (yuqorida e'lon — effectlar    */
  /* ularni ishlatadi)                        */
  /* ──────────────────────────────────────── */

  // FIX 8: fetchTopicsForSection — sections closure muammosi yo'q,
  // chunki sections parametr sifatida emas, balki setter pattern ishlatamiz
  const fetchTopicsForSection = useCallback(
    async (sectionId, allSections, isFirstSection, skipAutoSelect = false) => {
      try {
        const topic = await apiFetch(
          `${BASE_URL}/courses/courses/${slug}`
        );
        const topcis = topic.modules
        const safeTopics = Array.isArray(topics) ? topics : [];

        setTopicsMap((prev) => ({ ...prev, [sectionId]: safeTopics }));

        // FIX 8 (davomi): auto-select — sections parametrdan keladi, stale emas
        if (
          isFirstSection &&
          !skipAutoSelect &&
          !urlTopicId &&
          safeTopics.length > 0
        ) {
          const firstSection = allSections[0];
          setSelectedTopic(safeTopics[0]);
          setSelectedSection(firstSection);
        }
      } catch (err) {
        console.error("Topics yuklanmadi:", err);
        // Foydalanuvchiga ko'rsatish uchun (section darajasida xato)
        setTopicsMap((prev) => ({ ...prev, [sectionId]: [] }));
      }
    },
    [urlTopicId]
  );

  /* ──────────────────────────────────────── */
  /* Effects                                  */
  /* ──────────────────────────────────────── */

  // Init fetch
  useEffect(() => {
    if (!data?.length) {
      const init = async () => {
        setPageLoading(true);
        try {
          await fetchCourse();
        } finally {
          setPageLoading(false);
        }
      };
      init();
    } else {
      setPageLoading(false);
    }
  }, []);

  // Set initial course data from list only when detailed data is not yet loaded
  useEffect(() => {
    if (courseData || !data?.length || !id) return;

    const found = data.find((item) => toStr(item.id) === toStr(id));
    if (found) {
      setCourseData(normalizeCourseData(found));
    }
  }, [data, id, courseData]);

  // Check access
  // useEffect(() => {
  //   if (!accessLoading && !isBought && id) {
  //     const course = data?.find((c) => toStr(c.id) === toStr(id));
  //     if (course && slug) {
  //       navigate(`/kurslar/${slug}`, { replace: true });
  //     } else {
  //       navigate("/", { replace: true });
  //     }
  //   }
  // }, [isBought, accessLoading, id, data, slug, navigate]);
  // Fetch sections
  const isMountedRef = useRef(false);

  const loadCourseData = useCallback(async () => {
    setSectionsLoading(true);
    setSectionsError(null);

    try {
      const detail = await fetchCourseDetail(slug);
      if (!detail) {
        throw new Error("Kurs topilmadi");
      }

      if (!isMountedRef.current) return;

      setCourseData(normalizeCourseData(detail));

      const { sections: safeSections, topicsMap: initialTopicsMap } =
        buildSectionMap(detail);

      setSections(safeSections);
      setTopicsMap(initialTopicsMap);

      if (safeSections.length > 0) {
        const firstSection = safeSections[0];
        setExpandedSection(toStr(firstSection.id));
        setSelectedSection(firstSection);

        if (!urlTopicId) {
          setSelectedTopic(firstSection.lessons[0] ?? null);
        } else {
          // Find topic by slug from URL
          const allLessons = safeSections.flatMap((sec) => sec.lessons || []);
          const topicBySlug = allLessons.find((t) => t.slug === urlTopicId);
          if (topicBySlug) {
            setSelectedTopic(topicBySlug);
            const parentSec = safeSections.find((sec) =>
              (sec.lessons || []).some((t) => t.slug === topicBySlug.slug)
            );
            if (parentSec) {
              setSelectedSection(parentSec);
              setExpandedSection(toStr(parentSec.id));
            }
          }
        }
      }
    } catch (err) {
      console.error("Sectionlar yuklanmadi:", err);
      setSectionsError("Bo'limlar yuklanmadi. Qayta urinib ko'ring.");
    } finally {
      if (isMountedRef.current) {
        setSectionsLoading(false);
      }
    }
  }, [fetchCourseDetail, slug, urlTopicId]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    loadCourseData();
  }, [id, loadCourseData]);

  // FIX 11: Qolgan sectionlar uchun lazy fetch — faqat ochilgan section uchun
  // (barcha sectionlarni birdaniga fetch qilish o'rniga)
  useEffect(() => {
    if (expandedSection && !topicsMap[expandedSection]) {
      const parentSection = sections.find(
        (s) => toStr(s.id) === toStr(expandedSection)
      );
      if (parentSection) {
        fetchTopicsForSection(expandedSection, sections, false, true);
      }
    }
  }, [expandedSection, sections]); // topicsMap atay yo'q — loop oldini oladi

  // Fetch topic detail
  useEffect(() => {
    if (!selectedTopic?.id) return;

    let cancelled = false;

    const fetchDetail = async () => {
      setTopicLoading(true);
      setTopicDetail(null);
      setSubmitResult(null);
      setTopicError(null);

      try {
        // Yangi API: /courses/lessons/{slug}/ — video_url to'g'ridan keladi
        const lessonSlug = selectedTopic.slug;
        if (!lessonSlug) throw new Error("Topic slug mavjud emas");

        const detail = await apiFetch(
          `${BASE_URL}/courses/lessons/${lessonSlug}/`,
          { requireAuth: false }
        );
        if (cancelled) return;

        setTopicDetail(detail ?? null);
      } catch (err) {
        if (!cancelled) {
          console.error("Dars yuklanmadi:", err);
          setTopicError("Dars yuklanmadi. Qayta urinib ko'ring.");
        }
      } finally {
        if (!cancelled) setTopicLoading(false);
      }
    };

    fetchDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedTopic?.id]);

  // Handle URL topicId restore (now contains slug)
  useEffect(() => {
    if (!urlTopicId || sections.length === 0) return;
    // Slug-based comparison
    if (selectedTopic?.slug === urlTopicId && topicDetail) return;

    const allTopics = sections.flatMap((sec) => topicsMap[sec.id] || []);
    // Find topic by slug
    const found = allTopics.find((t) => t.slug === urlTopicId);

    if (!found) return;

    const parentSection = sections.find((sec) =>
      (topicsMap[sec.id] || []).some(
        (t) => t.slug === found.slug
      )
    );

    setSelectedTopic(found);
    setSelectedSection(parentSection || sections[0]);
    setExpandedSection(
      toStr(parentSection?.id) || toStr(sections[0]?.id) || null
    );
  }, [urlTopicId, sections, topicsMap]);

  // So'nggi to'htatilgan darsga auto-navigate — urlTopicId bo'lmasa
  useEffect(() => {
    if (urlTopicId || !id || !slug || sections.length === 0) return;
    const lastTopicSlug = localStorage.getItem(`last_topic_${id}`);
    if (!lastTopicSlug) return;
    // Faqat birinchi render da ishlashi uchun sections.length ni tekshiramiz
    navigate(`/kurslar/${slug}/${id}/${lastTopicSlug}`, { replace: true });
  }, [sections.length]); // intentionally minimal deps — faqat bir marta ishlash uchun

  /* ──────────────────────────────────────── */
  /* Callbacks                                */
  /* ──────────────────────────────────────── */

  const handleTopicClick = useCallback(
    (topic, knownSection = null) => {
      if (!topic) return;
      // Slug-based comparison
      if (selectedTopic?.slug === topic.slug) return;

      setSelectedTopic(topic);
      setCode("");

      const parentSection =
        knownSection ||
        sections.find((sec) =>
          (topicsMap[sec.id] || []).some(
            (t) => t.slug === topic.slug
          )
        );

      if (parentSection) {
        setSelectedSection(parentSection);
        setExpandedSection(toStr(parentSection.id));
      }

      // So'nggi ko'rilgan topic slugini kurs bo'yicha saqlash
      localStorage.setItem(`last_topic_${id}`, topic.slug);

      // FIX 12: replace: true — kurs ichida history stack to'planmaydi
      navigate(`/kurslar/${slug}/${id}/${topic.slug}`, { replace: true });
    },
    [selectedTopic?.slug, sections, topicsMap, navigate, slug, id]
  );

  const handleSectionClick = useCallback(
    (section) => {
      const sectionId = toStr(section.id);
      const isOpen = expandedSection === sectionId;
      setExpandedSection(isOpen ? null : sectionId);
      setSelectedSection(section);
    },
    [expandedSection]
  );
console.log(selectedTopic);

  // Darsni tugatilgan deb belgilash — POST /courses/lessons/{slug}/complete/
  const completeLesson = useCallback(async () => {
    const lessonSlug = topicDetail?.slug || selectedTopic?.slug;
    if (!lessonSlug) return;

    try {
      await apiFetch(`${BASE_URL}/courses/lessons/${lessonSlug}/complete/`, {
        method: "POST",
        requireAuth: true,
      });

      // Sidebar da is_completed ni yangilash
      if (selectedTopic?.id) {
        setTopicsMap((prev) => {
          const updated = {};
          for (const sId in prev) {
            updated[sId] = prev[sId].map((t) =>
              toStr(t.id) === toStr(selectedTopic.id)
                ? { ...t, is_completed: true }
                : t
            );
          }
          return updated;
        });
      }
    } catch (err) {
      console.error("Lesson complete xatosi:", err);
    }
  }, [topicDetail, selectedTopic]);

  // Video tugaganda — darsni tugatilgan deb belgilash va vaqtni tozalash
  const handleVideoEnded = useCallback(() => {
    completeLesson();
    if (selectedTopic?.id) {
      localStorage.removeItem(`video_time_${selectedTopic.id}`);
    }
  }, [completeLesson, selectedTopic?.id]);

  // Video vaqtini localStorage ga saqlash (har 5 soniyada)
  const lastSaveTimeRef = useRef(0);
  const handleTimeUpdate = useCallback(
    (data) => {
      if (!selectedTopic?.id) return;
      const now = Date.now();
      if (now - lastSaveTimeRef.current < 5000) return;
      lastSaveTimeRef.current = now;
      const t = data?.currentTime ?? data;
      if (t && typeof t === "number") {
        localStorage.setItem(`video_time_${selectedTopic.id}`, Math.floor(t));
      }
    },
    [selectedTopic?.id]
  );

  const goToAdjacent = useCallback(
    async (direction) => {
      const next = allTopicsFlat[currentIndex + direction];
      if (!next) return;

      // Keyingi darsga o'tishda joriy darsni tugatilgan deb belgilash
      if (direction > 0) {
        await completeLesson();
      }

      const parentSection = sections.find((sec) =>
        (topicsMap[sec.id] || []).some(
          (t) => toStr(t.id) === toStr(next.id)
        )
      );

      handleTopicClick(next, parentSection || null);
    },
    [allTopicsFlat, currentIndex, sections, topicsMap, handleTopicClick, completeLesson]
  );

  /* ──────────────────────────────────────── */
  /* Render Logic                             */
  /* ──────────────────────────────────────── */

  if (accessLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingOutlined style={{ fontSize: 36 }} className="text-blue-500" />
      </div>
    );
  }


  const fullUrl = `https://myrobo.adxamov.uz/kurslar/${slug}/${id}`;

  return (
    <>
      <Helmet>
        <title>
          {courseData?.title
            ? `${courseData.title} - Darslar | MyRobo.uz`
            : "Kurs - MyRobo.uz"}
        </title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
          name="description"
          content={
            courseData?.description?.slice(0, 155) ||
            "MyRobo platformasida kursni o'rganing."
          }
        />
        <meta
          property="og:title"
          content={courseData?.title || "Kurs - MyRobo.uz"}
        />
        <meta
          property="og:description"
          content={
            courseData?.description?.slice(0, 155) ||
            "MyRobo platformasida kursni o'rganing."
          }
        />
        {courseData?.image && (
          <meta property="og:image" content={courseData.image} />
        )}
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="w-[90%] mx-auto bg-gray-50 dark:bg-gray-900 p-3 md:p-6 transition-colors duration-300">
        <div className="mx-auto">
          <div className="mb-4">
            <div className="w-full bg-white dark:bg-gray-900/80 backdrop-blur-md px-4 py-3 rounded-lg shadow border border-transparent dark:border-gray-700 flex items-center justify-between gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                aria-label={sidebarOpen ? "Darslar menyusini yopish" : "Darslar menyusini ochish"}
              >
                {sidebarOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                <span className="hidden sm:inline">
                  {sidebarOpen ? "Yopish" : "Darslar"}
                </span>
              </button>

              {!courseData ? (
                <Skeleton className="h-9 w-72" />
              ) : (
                <h1 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
                  {courseData.title || "Kurs"}
                </h1>
              )}

              <div />
            </div>
          </div>

          <div
            className={`flex flex-col lg:flex-row gap-4 md:gap-6 ${sidebarOpen ? "justify-center" : "lg:gap-0"
              }`}
          >
            {/* ── SIDEBAR ── */}
            <aside
              className={`bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-lg shadow border border-transparent dark:border-gray-700 h-fit lg:sticky lg:top-20 transition-all duration-300 overflow-hidden ${sidebarOpen
                ? "w-full lg:w-1/4 p-4 opacity-100"
                : "w-0 p-0 opacity-0 pointer-events-none"
                }`}
              aria-hidden={!sidebarOpen}
            >
              {sectionsLoading ? (
                <SidebarSkeleton />
              ) : sectionsError ? (
                // FIX 6: Section xatosi ko'rsatiladi
                <ErrorBanner
                  message={sectionsError}
                  onRetry={() => {
                    setSectionsError(null);
                    loadCourseData();
                  }}
                />
              ) : sections.length === 0 ? (
                <EmptySections />
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Progress bar */}
                  <div className="pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        O'zlashtirish
                      </span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {courseData?.progress_percentage ?? 0}%
                      </span>
                    </div>
                    <div
                      className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden"
                      role="progressbar"
                      aria-valuenow={courseData?.progress_percentage ?? 0}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label="Kurs bo'yicha progress"
                    >
                      <div
                        className="bg-gradient-to-r from-blue-500 to-green-500 h-full transition-all duration-500 ease-out"
                        style={{
                          width: `${courseData?.progress_percentage ?? 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Sections list */}
                  <div className="space-y-1">
                    {sections.map((section) => (
                      <div key={section.id} className="mb-1">
                        <div
                          className={`flex items-center p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${toStr(selectedSection?.id) === toStr(section.id)
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-sm"
                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                            }`}
                          onClick={() => handleSectionClick(section)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSectionClick(section)
                          }
                          aria-expanded={
                            expandedSection === toStr(section.id)
                          }
                        >
                          <PlayCircleFilled
                            className={`mr-2.5 flex-shrink-0 ${toStr(selectedSection?.id) === toStr(section.id)
                              ? "text-blue-600"
                              : "text-gray-400"
                              }`}
                            aria-hidden="true"
                          />
                          <span className="text-sm font-medium leading-tight">
                            {section.title}
                          </span>
                        </div>

                        {/* Topics dropdown */}
                        {expandedSection === toStr(section.id) && (
                          <div className="ml-4 pl-2 border-l border-gray-100 dark:border-gray-700 mt-1 space-y-1">
                            {!topicsMap[section.id] ? (
                              <div className="py-2 space-y-2">
                                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full animate-pulse" />
                                <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-4/5 animate-pulse" />
                              </div>
                            ) : topicsMap[section.id].length === 0 ? (
                              <p className="text-[11px] text-gray-400 dark:text-gray-500 py-2">
                                Mavzular yuklanmagan
                              </p>
                            ) : (
                              topicsMap[section.id].map((topic) => (
                                <TopicItem
                                  key={topic.id}
                                  topic={topic}
                                  // FIX 4: toStr bilan solishtirish
                                  isSelected={
                                    toStr(selectedTopic?.id) ===
                                    toStr(topic.id)
                                  }
                                  onClick={() => {
                                    handleTopicClick(topic, section);
                                    // FIX 7: section ID saqlanadi (topic ID emas)
                                    localStorage.setItem(
                                      "last_section_id",
                                      toStr(section.id)
                                    );
                                  }}
                                />
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main
              className={`w-full transition-all duration-300  dark:bg-gray-900/80 backdrop-blur-md ${sidebarOpen ? "lg:w-3/4" : "lg:w-full"
                }`}
            >
              {!sectionsLoading && sections.length === 0 ? (
                <EmptyState courseTitle={courseData?.title} />
              ) : !selectedTopic ? (
                <SelectTopicPrompt />
              ) : topicLoading ? (
                <ContentSkeleton />
              ) : topicError ? (
                // FIX 6: Topic xatosi ko'rsatiladi
                <div className="mb-6 shadow bg-white  dark:bg-gray-900/80 backdrop-blur-md rounded-lg p-6 border border-transparent dark:border-gray-700">
                  <ErrorBanner
                    message={topicError}
                    onRetry={() => {
                      // selectedTopic ni qayta set qilib, effect ni trigger qilamiz
                      setTopicError(null);
                      setSelectedTopic((prev) => ({ ...prev }));
                    }}
                  />
                </div>
              ) : (
                <TopicContent
                  topicDetail={topicDetail}
                  videoId={videoId}
                  videoToken={videoToken}
                  videoStartFrom={
                    selectedTopic?.id
                      ? Number(localStorage.getItem(`video_time_${selectedTopic.id}`) || 0)
                      : 0
                  }
                  onVideoEnded={handleVideoEnded}
                  onVideoTimeUpdate={handleTimeUpdate}
                  problem={problem}
                  code={code}
                  setCode={setCode}
                  submitResult={submitResult}
                  setSubmitResult={setSubmitResult}
                  isFirst={isFirst}
                  isLast={isLast}
                  onPrevious={() => goToAdjacent(-1)}
                  onNext={() => goToAdjacent(1)}
                />
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );

};

/* ─── Extracted Components ─── */
function TopicItem({ topic, isSelected, isTest = false, onClick }) {
  return (
    <div
      className={`group flex items-center p-2 rounded-md cursor-pointer transition-all ${isSelected
        ? "bg-white dark:bg-gray-700 shadow-sm ring-1 ring-gray-200 dark:ring-gray-600"
        : "hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-600 dark:text-gray-400"
        }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-current={isSelected ? "page" : undefined}
    >
      <div className="mr-2.5 flex-shrink-0" aria-hidden="true">
        {topic.is_completed ? (
          <CheckCircleFilled className="text-green-500 text-sm" />
        ) : isTest ? (
          <ShieldQuestionMark className="text-blue-400 text-xs" />
        ) : topic.topic_type === "code" ? (
          <CodeOutlined className="text-blue-400 text-md" />
        ) : (
          <PlayCircleFilled className="text-gray-300 group-hover:text-blue-400 text-sm transition-colors" />
        )}
      </div>
      <span
        className={`text-[13px] leading-snug ${isSelected ? "font-semibold text-gray-900 dark:text-white" : ""
          }`}
      >
        {topic.title}
      </span>
    </div>
  );
}

function EmptyState({ courseTitle }) {
  return (
    <div className="mb-6 shadow bg-white dark:bg-gray-800 rounded-lg p-6 border border-transparent dark:border-gray-700">
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.2}
              d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {courseTitle || "Kurs"} kursi tayyorlanmoqda
          </h3>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-sm leading-relaxed">
            Hozircha bu kursda darslar mavjud emas.
          </p>
        </div>
        <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
          Yangilanishlarni kuzatib boring 👀
        </p>
      </div>
    </div>
  );
}

function SelectTopicPrompt() {
  return (
    <div className="mb-6 shadow bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-lg border border-transparent dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="font-semibold text-gray-800 dark:text-gray-100">
          Darsni tanlang
        </span>
      </div>
      <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
        Iltimos, chap menyudan darsni tanlang
      </div>
    </div>
  );
}

function TopicContent({
  topicDetail,
  videoId,
  videoToken,
  videoStartFrom,
  onVideoEnded,
  onVideoTimeUpdate,
  problem,
  code,
  setCode,
  submitResult,
  setSubmitResult,
  isFirst,
  isLast,
  onPrevious,
  onNext,
}) {
  return (
    <>
      {/* Video section */}
      <div className="mb-4 shadow bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-lg border border-transparent dark:border-gray-700 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-gray-800 dark:text-gray-100">
            {topicDetail?.title ?? ""}
          </span>
        </div>
        <div className="p-4 md:p-5">
          {videoId ? (
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-gray-900 mb-4">
              <KinescopeWithLoader
                videoId={videoId}
                token={videoToken}
                startFrom={videoStartFrom}
                onEnded={onVideoEnded}
                onTimeUpdate={onVideoTimeUpdate}
              />
            </div>
          ) : (
            // Video yo'q placeholder
            <div
              className="w-full aspect-video rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4"
              role="img"
              aria-label="Bu dars uchun video mavjud emas"
            >
              <div className="text-center text-gray-400 dark:text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-12 h-12 mx-auto mb-2 opacity-40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.2}
                    d="M15 10l4.553-2.069A1 1 0 0121 8.87V15.13a1 1 0 01-1.447.9L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                  />
                </svg>
                <p className="text-sm">Video mavjud emas</p>
              </div>
            </div>
          )}
          {/* Yangi API: description (avval about edi) */}
          {topicDetail?.description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
              {topicDetail.description}
            </p>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mb-4 gap-3">
        <Button
          type="primary"
          icon={<BookFilled />}
          onClick={onPrevious}
          disabled={isFirst}
          className="dark:!bg-gray-800 dark:!border-gray-700 dark:!text-white dark:hover:!bg-gray-700 dark:disabled:!bg-gray-900 dark:disabled:!text-gray-500 flex-1 sm:flex-none"
        >
          Oldingi dars
        </Button>
        <Button
          type="primary"
          icon={<CheckCircleFilled />}
          onClick={onNext}
          disabled={isLast}
          className="dark:!bg-gray-800 dark:!border-gray-700 dark:!text-white dark:hover:!bg-gray-700 dark:disabled:!bg-gray-900 dark:disabled:!text-gray-500 flex-1 sm:flex-none"
        >
          Keyingi dars
        </Button>
      </div>

      {/* Code editor — yangi API: lesson_type === "code" */}
      {topicDetail?.lesson_type === "code" && (
        <div className="bg-white dark:bg-gray-900/80 backdrop-blur-md rounded-lg shadow border border-transparent dark:border-gray-700 overflow-hidden">
          {problem && <ProblemSection problem={problem} />}
          <div className="p-4">
            <CodeEditor
              onChange={setCode}
              onRun={code}
              topicId={topicDetail?.id}
            />
          </div>
          {submitResult && (
            <ResultBadge
              status={submitResult.status}
              errorMessage={submitResult.error_message}
            />
          )}
        </div>
      )}
    </>
  );
}

function ProblemSection({ problem }) {
  return (
    <div className="mb-2 p-4 border-b border-gray-200 dark:border-gray-700">
      {problem.title && (
        <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {problem.title}
        </h2>
      )}
      {problem.statement && (
        <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
          {problem.statement}
        </p>
      )}
      {(problem.sample_input != null || problem.sample_output != null) && (
        <div className="grid md:grid-cols-2 gap-4">
          {problem.sample_input != null && (
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Input:
              </p>
              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {problem.sample_input}
              </pre>
            </div>
          )}
          {problem.sample_output != null && (
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                Output:
              </p>
              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {problem.sample_output}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultBadge({ status, errorMessage }) {
  const isAccepted = status === "accepted";
  return (
    <div
      className={`mx-4 mb-4 p-4 rounded-lg flex items-start gap-3 ${isAccepted
        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
        }`}
      role="alert"
    >
      <span className="text-lg font-bold" aria-hidden="true">
        {isAccepted ? "✓" : "✗"}
      </span>
      <div>
        <p className="font-semibold">
          {isAccepted ? "Qabul qilindi!" : `Xatolik: ${status}`}
        </p>
        {errorMessage && (
          <p className="text-sm mt-1 font-mono">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}

export default FrontendCourse;