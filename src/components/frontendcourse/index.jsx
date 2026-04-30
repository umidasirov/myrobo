import React, { useEffect, useState, useCallback, useRef } from "react";
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

function Skeleton({ className = "" }) {
  return (
    <div className={`bg-gray-200 dark:bg-gray-700 rounded animate-pulse ${className}`} />
  );
}

function VdoCipherPlayer({ otp, playbackInfo }) {
  if (!otp || !playbackInfo)
    return (
      <div className="w-full aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
        <LoadingOutlined style={{ fontSize: 32 }} className="text-blue-400" />
      </div>
    );

  return (
    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%" }}>
      <iframe
        key={otp}
        src={`https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "8px",
          border: "none",
        }}
        allow="encrypted-media"
        allowFullScreen
      />
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
    <div className="mb-6 shadow bg-white dark:bg-gray-800 rounded-lg p-6 border border-transparent dark:border-gray-700">
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

const FrontendCourse = () => {
  const { data, fetchCourse } = useData();
  const { slug, courseId: id, topicId: urlTopicId } = useParams();

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const { isBought, loading: accessLoading } = useCourseAccess(id);

  useEffect(() => {
    if (!accessLoading && !isBought && id) {
      const course = data?.find((c) => String(c.id) === String(id));
      if (course && slug) {
        navigate(`/kurslar/${slug}`, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [isBought, accessLoading]);

  const [courseData, setCourseData] = useState(null);
  const [sections, setSections] = useState([]);
  const [topicsMap, setTopicsMap] = useState({});
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicDetail, setTopicDetail] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const [topicLoading, setTopicLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [code, setCode] = useState("");

  useEffect(() => {
    const init = async () => {
      setPageLoading(true);
      try {
        await fetchCourse();
      } finally {
        setPageLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (data && data.length > 0 && id) {
      const found = data.find((item) => item?.id == id);
      if (found) setCourseData(found);
    }
  }, [data, id]);

  useEffect(() => {
    if (!urlTopicId) return;
    if (sections.length === 0) return;
    if (selectedTopic?.id === urlTopicId && topicDetail) return;

    const allTopics = sections.flatMap((sec) => topicsMap[sec.id] || []);
    const foundTopic = allTopics.find((t) => t.id === urlTopicId);

    if (foundTopic) {
      setSelectedTopic(foundTopic);
      fetchTopicDetail(foundTopic.id);

      const parentSection = sections.find((sec) =>
        (topicsMap[sec.id] || []).some((t) => t.id === foundTopic.id)
      );
      if (parentSection) {
        setExpandedSection(parentSection.id);
        setSelectedSection(parentSection);
      }
    }
  }, [urlTopicId, sections, topicsMap]);

  useEffect(() => {
    if (!id) return;
    const fetchSections = async () => {
      setSectionsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/courses/courses/${id}/sections/`, {
          headers: { "Content-Type": "application/json" },
        });
        const result = await res.json();
        setSections(result);

        if (result.length > 0) {
          setExpandedSection(result[0].id);
          setSelectedSection(result[0]);

          if (!urlTopicId) {
            fetchTopicsForSection(result[0].id, true);
          } else {
            for (const section of result) {
              fetchTopicsForSection(section.id, false);
            }
          }
        }
      } catch (err) {
      } finally {
        setSectionsLoading(false);
      }
    };
    fetchSections();
  }, [id, urlTopicId]);

  const fetchTopicsForSection = useCallback(
    async (sectionId, autoSelectFirst = false) => {
      try {
        const res = await fetch(
          `${BASE_URL}/courses/sections/${sectionId}/topics/`,
          { headers: { "Content-Type": "application/json" } }
        );
        const topics = await res.json();
        setTopicsMap((prev) => ({ ...prev, [sectionId]: topics }));
        if (autoSelectFirst && topics.length > 0) {
          setTimeout(() => handleTopicClick(topics[0]), 50);
        }
      } catch (err) { }
    },
    []
  );

  const [videoOtp, setVideoOtp] = useState(null);

  const fetchVideoOtp = async (topicId) => {
    try {
      const res = await fetch(`${BASE_URL}/courses/topics/${topicId}/video-otp/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setVideoOtp(data);
    } catch (err) { }
  };

  const fetchTopicDetail = async (topicId) => {
    setTopicLoading(true);
    setTopicDetail(null);
    setSubmitResult(null);
    setVideoOtp(null);
    try {
      const res = await fetch(`${BASE_URL}/courses/topics/${topicId}/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const detail = await res.json();
      setTopicDetail(detail);
      if (detail?.vdo_video_id) {
        await fetchVideoOtp(topicId);
      }
    } catch (err) {
    } finally {
      setTopicLoading(false);
    }
  };

  const handleSectionClick = (section) => {
    const isOpen = expandedSection === section.id;
    setExpandedSection(isOpen ? null : section.id);
    setSelectedSection(section);
    if (!isOpen && !topicsMap[section.id]) {
      fetchTopicsForSection(section.id);
    }
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    fetchTopicDetail(topic.id);
    setCode("");
    navigate(`/kurslar/${slug}/${id}/${topic.id}`, { replace: false });
  };

  const getAllTopicsFlat = () =>
    sections.flatMap((sec) => topicsMap[sec.id] || []);

  const goToAdjacent = (direction) => {
    const allTopics = getAllTopicsFlat();
    const currentIndex = allTopics.findIndex((t) => t.id === selectedTopic?.id);
    const nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < allTopics.length) {
      const nextTopic = allTopics[nextIndex];
      handleTopicClick(nextTopic);
      const parentSection = sections.find((sec) =>
        (topicsMap[sec.id] || []).some((t) => t.id === nextTopic.id)
      );
      if (parentSection) {
        setExpandedSection(parentSection.id);
        setSelectedSection(parentSection);
      }
    }
  };

  const allTopicsFlat = getAllTopicsFlat();
  const currentIndex = allTopicsFlat.findIndex((t) => t.id === selectedTopic?.id);
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= allTopicsFlat.length - 1;

  /* ── Loading ── */
  if (accessLoading || pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <LoadingOutlined style={{ fontSize: 36 }} className="text-blue-500" />
      </div>
    );
  }

  if (!isBought) return null;

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
        <meta property="og:title" content={courseData?.title || "Kurs - MyRobo.uz"} />
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

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-3 md:p-6 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">

          {/* Kurs nomi */}
          <div className="text-center mb-4">
            {!courseData ? (
              <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-transparent dark:border-gray-700 flex justify-center">
                <Skeleton className="h-9 w-72" />
              </div>
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-transparent dark:border-gray-700">
                {courseData?.title || "Kurs"}
              </h1>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4 md:gap-6">

            {/* ── Sidebar ── */}
            <div className="w-full lg:w-1/4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-transparent dark:border-gray-700 h-fit lg:sticky lg:top-20">
              {sectionsLoading ? (
                <SidebarSkeleton />
              ) : sections.length === 0 ? (
                <EmptySections />
              ) : (
                <div className="space-y-1">
                  {sections.map((section) => (
                    <div key={section.id}>
                      {/* Bo'lim sarlavhasi */}
                      <div
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors
                          hover:bg-blue-50 dark:hover:bg-blue-900/20
                          ${selectedSection?.id === section.id
                            ? "bg-blue-100 dark:bg-blue-900/30 font-medium"
                            : ""
                          }`}
                        onClick={() => handleSectionClick(section)}
                      >
                        <PlayCircleFilled className="text-blue-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                          {section.title}
                        </span>
                      </div>

                      {/* Mavzular ro'yxati */}
                      {expandedSection === section.id && (
                        <div className="ml-5 space-y-0.5 mt-0.5">
                          {!topicsMap[section.id] ? (
                            <div className="space-y-1 py-1">
                              <Skeleton className="h-7 w-full rounded" />
                              <Skeleton className="h-7 w-4/5 rounded" />
                              <Skeleton className="h-7 w-3/5 rounded" />
                            </div>
                          ) : topicsMap[section.id].length === 0 ? (
                            <p className="text-xs text-gray-400 dark:text-gray-500 py-2 px-2">
                              Mavzular yo'q
                            </p>
                          ) : (
                            topicsMap[section.id].map((topic) => (
                              <div
                                key={topic.id}
                                className={`flex items-center p-2 rounded cursor-pointer transition-colors
                                  hover:bg-blue-50 dark:hover:bg-blue-900/20
                                  ${selectedTopic?.id === topic.id
                                    ? "bg-blue-200 dark:bg-blue-800/50 font-medium"
                                    : ""
                                  }`}
                                onClick={() => handleTopicClick(topic)}
                              >
                                {topic.topic_type !== "code" ? (
                                  <PlayCircleFilled className="text-blue-400 mr-2 flex-shrink-0" />
                                ) : (
                                  <CodeOutlined className="text-green-500 mr-2 flex-shrink-0" />
                                )}
                                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 leading-snug">
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
            </div>

            {/* ── Asosiy kontent ── */}
            <div className="w-full lg:w-3/4">

              {/* Bo'sh holat */}
              {!sectionsLoading && sections.length === 0 ? (
                <div className="mb-6 shadow bg-white dark:bg-gray-800 rounded-lg p-6 border border-transparent dark:border-gray-700">
                  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-900/10 flex items-center justify-center">
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
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                        {courseData?.title} kursi tayyorlanmoqda
                      </h3>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-sm leading-relaxed">
                        Hozircha bu kursda darslar mavjud emas. O'qituvchi tez
                        orada video darslar va topshiriqlarni qo'shadi.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 w-full max-w-xs">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3">
                        <span className="text-lg">🎬</span>
                        <div className="text-left">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Video darslar
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Tez orada qo'shiladi
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 rounded-xl px-4 py-3">
                        <span className="text-lg">💻</span>
                        <div className="text-left">
                          <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Amaliy topshiriqlar
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            Tez orada qo'shiladi
                          </p>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 dark:text-gray-600 mt-2">
                      Yangilanishlarni kuzatib boring 👀
                    </p>
                  </div>
                </div>

                /* Dars tanlanmagan */
              ) : !selectedTopic ? (
                <div className="mb-6 shadow bg-white dark:bg-gray-800 rounded-lg border border-transparent dark:border-gray-700 overflow-hidden">
                  <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-800 dark:text-gray-100">
                      Darsni tanlang
                    </span>
                  </div>
                  <div className="text-center py-10 text-gray-500 dark:text-gray-400 text-sm">
                    Iltimos, chap menyudan darsni tanlang
                  </div>
                </div>

                /* Dars yuklanmoqda */
              ) : topicLoading ? (
                <ContentSkeleton />

                /* Dars kontenti */
              ) : (
                <>
                  {/* Video / sarlavha karti */}
                  <div className="mb-4 shadow bg-white dark:bg-gray-800 rounded-lg border border-transparent dark:border-gray-700 overflow-hidden">
                    {/* Kart sarlavhasi */}
                    <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
                      <span className="font-semibold text-gray-800 dark:text-gray-100">
                        {topicDetail?.title}
                      </span>
                    </div>
                    <div className="p-4 md:p-5">
                      {/* Video player */}
                      {videoOtp?.otp && videoOtp?.playbackInfo && (
                        <div className="mb-4">
                          <VdoCipherPlayer
                            otp={videoOtp.otp}
                            playbackInfo={videoOtp.playbackInfo}
                          />
                        </div>
                      )}
                      {/* Tavsif */}
                      {topicDetail?.about && (
                        <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
                          {topicDetail.about}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Navigatsiya tugmalari */}
                  <div className="flex justify-between mb-4">
                    <Button
                      type="primary"
                      icon={<BookFilled />}
                      onClick={() => goToAdjacent(-1)}
                      disabled={isFirst}
                      className="
                      dark:!bg-gray-800 
                      dark:!border-gray-700 
                      dark:!text-white 
                      dark:hover:!bg-gray-700
                      dark:disabled:!bg-gray-900
                      dark:disabled:!text-gray-500"
                    >
                      Oldingi dars
                    </Button>

                    <Button
                      type="primary"
                      icon={<CheckCircleFilled />}
                      onClick={() => goToAdjacent(1)}
                      disabled={isLast}
                      className="
                      dark:!bg-gray-800 
                      dark:!border-gray-700 
                      dark:!text-white 
                      dark:hover:!bg-gray-700
                      dark:disabled:!bg-gray-900
                      dark:disabled:!text-gray-500"
                    >
                      Keyingi dars
                    </Button>
                  </div>
                  {/* Kod muharriri */}
                  {topicDetail?.topic_type === "code" && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-transparent dark:border-gray-700 overflow-hidden">
                      {topicDetail.problem && (
                        <div className="mb-2 p-4 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            {topicDetail.problem.title}
                          </h2>
                          <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                            {topicDetail.problem.statement}
                          </p>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Input:
                              </p>
                              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                                {topicDetail.problem.sample_input}
                              </pre>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
                              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                Output:
                              </p>
                              <pre className="text-sm font-mono whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                                {topicDetail.problem.sample_output}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="p-4">
                        <CodeEditor
                          onChange={setCode}
                          onRun={code}
                          topicId={topicDetail.id}
                        />
                      </div>

                      {/* Submit natijasi */}
                      {submitResult && (
                        <div
                          className={`mx-4 mb-4 p-4 rounded-lg flex items-start gap-3 ${submitResult.status === "accepted"
                              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
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
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FrontendCourse;
