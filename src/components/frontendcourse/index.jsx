import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  useReducer,
} from "react";
import { Card, Button } from "antd";
import {
  PlayCircleFilled,
  BookFilled,
  CheckCircleFilled,
  CodeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useData } from "../../datacontect";
import CodeEditor from "../codeEditor";
import { useNavigate, useParams } from "react-router-dom";
import { useCourseAccess } from "../../hooks/useCourseAccess";
import { Helmet } from "react-helmet-async";

const BASE_URL = "https://myrobo.uz/api";

async function apiFetch(url, options = {}, signal) {
  const res = await fetch(url, { ...options, signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`);
  return res.json();
}

function useStableCallback(fn) {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args) => ref.current(...args), []);
}

function useVideoOtp(token) {
  const [videoOtp, setVideoOtp] = useState(null);
  const abortRef = useRef(null);

  const fetchOtp = useCallback(
    async (topicId) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      setVideoOtp(null);
      try {
        const data = await apiFetch(
          `${BASE_URL}/courses/topics/${topicId}/video-otp/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
          abortRef.current.signal
        );
        setVideoOtp(data);
      } catch (err) {
        if (err.name !== "AbortError") console.error("[OTP]", err);
      }
    },
    [token]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setVideoOtp(null);
  }, []);

  useEffect(() => () => abortRef.current?.abort(), []);

  return { videoOtp, fetchOtp, resetOtp: reset };
}

const INITIAL_STATE = {
  sections: [],
  topicsMap: {},
  selectedSection: null,
  selectedTopic: null,
  topicDetail: null,
  expandedSection: null,
  sectionsLoading: false,
  topicLoading: false,
  submitResult: null,
  error: null,
};

function playerReducer(state, action) {
  switch (action.type) {
    case "SECTIONS_LOADING":
      return { ...state, sectionsLoading: true, error: null };
    case "SECTIONS_LOADED":
      return { ...state, sectionsLoading: false, sections: action.sections };
    case "SECTIONS_ERROR":
      return { ...state, sectionsLoading: false, error: action.error };
    case "TOPICS_LOADED":
      return {
        ...state,
        topicsMap: { ...state.topicsMap, [action.sectionId]: action.topics },
      };
    case "SELECT_SECTION":
      return {
        ...state,
        selectedSection: action.section,
        expandedSection: action.section.id,
      };
    case "TOGGLE_SECTION":
      return {
        ...state,
        expandedSection: state.expandedSection === action.id ? null : action.id,
      };
    case "TOPIC_LOADING":
      return {
        ...state,
        topicLoading: true,
        topicDetail: null,
        submitResult: null,
      };
    case "TOPIC_LOADED":
      return {
        ...state,
        topicLoading: false,
        topicDetail: action.detail,
        selectedTopic: action.topic,
      };
    case "TOPIC_ERROR":
      return { ...state, topicLoading: false, error: action.error };
    case "SUBMIT_RESULT":
      return { ...state, submitResult: action.result };
    default:
      return state;
  }
}

function VdoCipherPlayer({ otp, playbackInfo }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!otp || !playbackInfo || !containerRef.current) return;

    let cancelled = false;

    const mount = () => {
      if (cancelled || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      new window.VdoPlayer({
        otp,
        playbackInfo,
        theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
        container: containerRef.current,
      });
    };

    if (!window.VdoPlayer) {
      const existing = document.querySelector('script[data-vdo]');
      if (existing) {
        existing.addEventListener("load", mount);
        return () => {
          cancelled = true;
          existing.removeEventListener("load", mount);
        };
      }
      const script = document.createElement("script");
      script.src = "https://player.vdocipher.com/playerAssets/1.6.10/vdo.js";
      script.async = true;
      script.dataset.vdo = "1";
      script.onload = mount;
      document.body.appendChild(script);
    } else {
      mount();
    }

    return () => {
      cancelled = true;
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [otp, playbackInfo]);

  if (!otp || !playbackInfo) {
    return (
      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <LoadingOutlined style={{ fontSize: 32 }} className="text-blue-400" />
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 8,
        }}
      />
    </div>
  );
}

function Skeleton({ className = "", style }) {
  return (
    <div
      className={`bg-gray-200 rounded animate-pulse ${className}`}
      style={style}
    />
  );
}

function SidebarSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-1">
          <Skeleton className="h-9 w-full" />
          {i <= 2 && (
            <div className="ml-6 space-y-1">
              <Skeleton className="h-7 w-5/6" />
              <Skeleton className="h-7 w-4/6" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <Card className="mb-6 shadow">
      <div className="space-y-4">
        <Skeleton className="h-7 w-1/2" />
        <Skeleton style={{ height: 400 }} className="w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </Card>
  );
}

function EmptySections() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-blue-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
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
        <p className="text-gray-700 font-semibold text-sm">
          Darslar hali qo'shilmagan
        </p>
        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
          Kurs tayyorlanmoqda.
          <br />
          Tez orada darslar joylashtiriladi!
        </p>
      </div>
    </div>
  );
}

function EmptyCourse({ title }) {
  return (
    <Card className="mb-6 shadow">
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-blue-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
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
          <h3 className="text-lg font-semibold text-gray-700">
            {title} kursi tayyorlanmoqda
          </h3>
          <p className="text-gray-400 text-sm mt-2 max-w-sm leading-relaxed">
            Hozircha bu kursda darslar mavjud emas. O'qituvchi tez orada video
            darslar va topshiriqlarni qo'shadi.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          {[
            ["🎬", "Video darslar"],
            ["💻", "Amaliy topshiriqlar"],
          ].map(([icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
            >
              <span className="text-lg">{icon}</span>
              <div className="text-left">
                <p className="text-xs font-medium text-gray-600">{label}</p>
                <p className="text-xs text-gray-400">Tez orada qo'shiladi</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-300 mt-2">
          Yangilanishlarni kuzatib boring 👀
        </p>
      </div>
    </Card>
  );
}

function CodeSection({ topicDetail, code, setCode, submitResult }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {topicDetail.problem && (
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-2">
            {topicDetail.problem.title}
          </h2>
          <p className="text-gray-700 mb-3">
            {topicDetail.problem.statement}
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              ["Input", topicDetail.problem.sample_input],
              ["Output", topicDetail.problem.sample_output],
            ].map(([label, value]) => (
              <div key={label} className="bg-white p-3 rounded border">
                <p className="text-sm font-semibold text-gray-500 mb-1">
                  {label}:
                </p>
                <pre className="text-sm font-mono whitespace-pre-wrap">
                  {value}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <CodeEditor onChange={setCode} onRun={code} topicId={topicDetail.id} />
      </div>

      {submitResult && (
        <div
          className={`mx-4 mb-4 p-4 rounded-lg flex items-start gap-3 ${
            submitResult.status === "accepted"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <span className="text-lg font-bold">
            {submitResult.status === "accepted" ? "✓" : "✗"}
          </span>
          <div>
            <p className="font-semibold">
              {submitResult.status === "accepted"
                ? "Qabul qilindi!"
                : `Xatolik: ${submitResult.status}`}
            </p>
            {submitResult.error_message && (
              <p className="text-sm mt-1 font-mono">
                {submitResult.error_message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const FrontendCourse = () => {
  const { data, fetchCourse } = useData();
  const { slug, courseId: id, topicId: urlTopicId } = useParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { isBought, loading: accessLoading } = useCourseAccess(id);
  const [state, dispatch] = useReducer(playerReducer, INITIAL_STATE);
  const [courseData, setCourseData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [code, setCode] = useState("");

  const { videoOtp, fetchOtp, resetOtp } = useVideoOtp(token);

  const sectionsAbort = useRef(null);
  const topicAbort = useRef(null);

  useEffect(() => {
    if (accessLoading || isBought || !id) return;
    const course = data?.find((c) => String(c.id) === String(id));
    navigate(course && slug ? `/kurslar/${slug}` : "/", { replace: true });
  }, [isBought, accessLoading]);

  useEffect(() => {
    fetchCourse().finally(() => setPageLoading(false));
  }, []);

  useEffect(() => {
    if (!data?.length || !id) return;
    const found = data.find((item) => item?.id == id);
    if (found) setCourseData(found);
  }, [data, id]);

  const fetchTopicDetail = useStableCallback(async (topic) => {
    topicAbort.current?.abort();
    topicAbort.current = new AbortController();

    dispatch({ type: "TOPIC_LOADING" });
    resetOtp();

    try {
      const detail = await apiFetch(
        `${BASE_URL}/courses/topics/${topic.id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
        topicAbort.current.signal
      );
      dispatch({ type: "TOPIC_LOADED", detail, topic });
      if (detail?.vdo_video_id) fetchOtp(topic.id);
    } catch (err) {
      if (err.name !== "AbortError")
        dispatch({ type: "TOPIC_ERROR", error: err.message });
    }
  });

  const handleTopicClick = useStableCallback((topic) => {
    setCode("");
    navigate(`/kurslar/${slug}/${id}/${topic.id}`, { replace: false });
    fetchTopicDetail(topic);
  });

  const fetchTopicsForSection = useCallback(
    async (sectionId, { autoSelect = false } = {}) => {
      try {
        const topics = await apiFetch(
          `${BASE_URL}/courses/sections/${sectionId}/topics/`,
          { headers: { "Content-Type": "application/json" } }
        );
        dispatch({ type: "TOPICS_LOADED", sectionId, topics });
        if (autoSelect && topics.length > 0) handleTopicClick(topics[0]);
      } catch (err) {
        if (err.name !== "AbortError")
          console.error("[Topics]", sectionId, err);
      }
    },
    []
  );

  useEffect(() => {
    if (!id) return;

    sectionsAbort.current?.abort();
    sectionsAbort.current = new AbortController();
    dispatch({ type: "SECTIONS_LOADING" });

    apiFetch(
      `${BASE_URL}/courses/courses/${id}/sections/`,
      { headers: { "Content-Type": "application/json" } },
      sectionsAbort.current.signal
    )
      .then(async (sections) => {
        dispatch({ type: "SECTIONS_LOADED", sections });
        if (!sections.length) return;

        dispatch({ type: "SELECT_SECTION", section: sections[0] });

        if (!urlTopicId) {
          await fetchTopicsForSection(sections[0].id, { autoSelect: true });
        } else {
          await Promise.all(
            sections.map((s) => fetchTopicsForSection(s.id))
          );
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError")
          dispatch({ type: "SECTIONS_ERROR", error: err.message });
      });

    return () => sectionsAbort.current?.abort();
  }, [id]);

  const urlTopicHandled = useRef(false);

  useEffect(() => {
    urlTopicHandled.current = false;
  }, [urlTopicId]);

  useEffect(() => {
    if (!urlTopicId || urlTopicHandled.current) return;

    const allTopics = state.sections.flatMap(
      (s) => state.topicsMap[s.id] || []
    );
    if (!allTopics.length) return;

    const found = allTopics.find((t) => t.id === urlTopicId);
    if (!found) return;

    urlTopicHandled.current = true;
    handleTopicClick(found);

    const parent = state.sections.find((s) =>
      (state.topicsMap[s.id] || []).some((t) => t.id === found.id)
    );
    if (parent) dispatch({ type: "SELECT_SECTION", section: parent });
  }, [urlTopicId, state.sections, state.topicsMap]);

  useEffect(
    () => () => {
      sectionsAbort.current?.abort();
      topicAbort.current?.abort();
    },
    []
  );

  const allTopicsFlat = useMemo(
    () => state.sections.flatMap((s) => state.topicsMap[s.id] || []),
    [state.sections, state.topicsMap]
  );

  const currentIndex = useMemo(
    () => allTopicsFlat.findIndex((t) => t.id === state.selectedTopic?.id),
    [allTopicsFlat, state.selectedTopic]
  );

  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= allTopicsFlat.length - 1;

  const handleSectionClick = useCallback(
    (section) => {
      dispatch({ type: "TOGGLE_SECTION", id: section.id });
      dispatch({ type: "SELECT_SECTION", section });
      if (!state.topicsMap[section.id]) fetchTopicsForSection(section.id);
    },
    [state.topicsMap, fetchTopicsForSection]
  );

  const goToAdjacent = useCallback(
    (dir) => {
      const next = allTopicsFlat[currentIndex + dir];
      if (!next) return;
      handleTopicClick(next);
      const parent = state.sections.find((s) =>
        (state.topicsMap[s.id] || []).some((t) => t.id === next.id)
      );
      if (parent) dispatch({ type: "SELECT_SECTION", section: parent });
    },
    [allTopicsFlat, currentIndex, state.sections, state.topicsMap]
  );

  if (accessLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingOutlined style={{ fontSize: 36 }} className="text-blue-500" />
      </div>
    );
  }

  if (!isBought) return null;

  const {
    sections,
    topicsMap,
    selectedSection,
    selectedTopic,
    topicDetail,
    expandedSection,
    sectionsLoading,
    topicLoading,
  } = state;

  const fullUrl = `https://myrobo.uz/kurslar/${slug}/${id}`;

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
            courseData?.about?.slice(0, 155) ||
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
            courseData?.about?.slice(0, 155) ||
            "MyRobo platformasida kursni o'rganing."
          }
        />
        <meta property="og:image" content={courseData?.image} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-2">
            {!courseData ? (
              <div className="w-full bg-white p-4 rounded-lg shadow flex justify-center">
                <Skeleton className="h-9 w-72" />
              </div>
            ) : (
              <h1 className="text-3xl font-bold text-gray-800 w-full bg-white p-4 rounded-lg shadow">
                {courseData.title}
              </h1>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
              {sectionsLoading ? (
                <SidebarSkeleton />
              ) : sections.length === 0 ? (
                <EmptySections />
              ) : (
                <div className="space-y-2">
                  {sections.map((section) => (
                    <div key={section.id}>
                      <div
                        className={`flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors ${
                          selectedSection?.id === section.id
                            ? "bg-blue-100 font-medium"
                            : ""
                        }`}
                        onClick={() => handleSectionClick(section)}
                      >
                        <PlayCircleFilled className="text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-sm leading-snug">
                          {section.title}
                        </span>
                      </div>

                      {expandedSection === section.id && (
                        <div className="ml-6 space-y-1 mt-1">
                          {!topicsMap[section.id] ? (
                            <div className="space-y-1 py-1">
                              <Skeleton className="h-7 w-full" />
                              <Skeleton className="h-7 w-4/5" />
                              <Skeleton className="h-7 w-3/5" />
                            </div>
                          ) : topicsMap[section.id].length === 0 ? (
                            <p className="text-xs text-gray-400 py-2 px-2">
                              Mavzular yo'q
                            </p>
                          ) : (
                            topicsMap[section.id].map((topic) => (
                              <div
                                key={topic.id}
                                className={`flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer transition-colors ${
                                  selectedTopic?.id === topic.id
                                    ? "bg-blue-200 font-medium"
                                    : ""
                                }`}
                                onClick={() => handleTopicClick(topic)}
                              >
                                {topic.topic_type !== "code" ? (
                                  <PlayCircleFilled className="text-blue-400 mr-2 text-xl flex-shrink-0" />
                                ) : (
                                  <CodeOutlined className="text-blue-400 mr-2 text-xl flex-shrink-0" />
                                )}
                                <span className="text-sm leading-snug">
                                  {topic.title}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </aside>

            <main className="w-full lg:w-3/4">
              {!sectionsLoading && sections.length === 0 ? (
                <EmptyCourse title={courseData?.title} />
              ) : !selectedTopic ? (
                <Card title="Darsni tanlang" className="mb-6 shadow">
                  <div className="text-center py-8 text-gray-500">
                    Iltimos, chap menyudan darsni tanlang
                  </div>
                </Card>
              ) : topicLoading ? (
                <ContentSkeleton />
              ) : (
                <>
                  <Card title={topicDetail?.title} className="mb-6 shadow">
                    {topicDetail?.topic_type !== "code" && (
                      <div className="mb-4">
                        <VdoCipherPlayer
                          key={topicDetail?.id}
                          otp={videoOtp?.otp}
                          playbackInfo={videoOtp?.playbackInfo}
                        />
                      </div>
                    )}
                    {topicDetail?.about && (
                      <div className="prose max-w-none">
                        <p>{topicDetail.about}</p>
                      </div>
                    )}
                  </Card>

                  <div className="flex justify-between mb-6">
                    <Button
                      type="primary"
                      icon={<BookFilled />}
                      onClick={() => goToAdjacent(-1)}
                      disabled={isFirst}
                    >
                      Oldingi dars
                    </Button>
                    <Button
                      type="primary"
                      icon={<CheckCircleFilled />}
                      onClick={() => goToAdjacent(1)}
                      disabled={isLast}
                    >
                      Keyingi dars
                    </Button>
                  </div>

                  {topicDetail?.topic_type === "code" && (
                    <CodeSection
                      topicDetail={topicDetail}
                      code={code}
                      setCode={setCode}
                      submitResult={state.submitResult}
                    />
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default FrontendCourse;