import React, { useEffect, useState, useCallback } from "react";
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
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://api.myrobo.uz";
function Skeleton({ className = "" }) {
  return <div className={`bg-gray-200 rounded animate-pulse ${className}`} />;
}
function VimeoIframe({ url }) {
  const videoId = url.split("/").pop().split("?")[0];

  return (
    <iframe
      src={`https://player.vimeo.com/video/${videoId}`}
      width="100%"
      height="400"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    ></iframe>
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
    <Card className="mb-6 shadow">
      <div className="space-y-4">
        <Skeleton className="h-7 w-1/2 rounded" />
        <Skeleton className="w-full rounded-lg" style={{ height: "400px" }} />
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-4/5 rounded" />
        <Skeleton className="h-4 w-3/5 rounded" />
      </div>
    </Card>
  );
}

const FrontendCourse = () => {
  const { data, fetchCourse } = useData();
  const id = localStorage.getItem("locate");
  const token = localStorage.getItem("token");

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
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("py");
  const navigate = useNavigate()
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
          fetchTopicsForSection(result[0].id, true);
        }
      } catch (err) {
        console.error("Sections xatolik:", err);
      } finally {
        setSectionsLoading(false);
      }
    };
    fetchSections();
  }, [id]);

  const fetchTopicsForSection = useCallback(async (sectionId, autoSelectFirst = false) => {
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
    } catch (err) {
      console.error("Topics xatolik:", err);
    }
  }, []);

  const fetchTopicDetail = async (topicId) => {
    setTopicLoading(true);
    setTopicDetail(null);
    setSubmitResult(null);
    try {
      const res = await fetch(`${BASE_URL}/courses/topics/${topicId}/`, {
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const detail = await res.json();
      setTopicDetail(detail);
    } catch (err) {
      console.error("Topic detail xatolik:", err);
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

  const handleSubmit = async () => {
    if (!selectedTopic || !code.trim()) return;
    setSubmitLoading(true);
    setSubmitResult(null);
    try {
      const res = await fetch(
        `${BASE_URL}/courses/topics/${selectedTopic.id}/submit/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ language, source_code: code }),
        }
      );
      const result = await res.json();
      setSubmitResult(result);
    } catch (err) {
      console.error("Submit xatolik:", err);
    } finally {
      setSubmitLoading(false);
    }
  };
  console.log(courseData);
  console.log(sections);
  console.log(topicDetail);
  console.log(topicsMap);
  if (topicDetail?.detail === "Kurs yopiq. To'lov qiling.") {
    navigate('/kirish2')
  }
  
function getVimeoEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (!match) return null;
  return `https://player.vimeo.com/video/${match[1]}`;
}

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-2">
          {pageLoading || !courseData ? (
            <div className="w-full bg-white p-4 rounded-lg shadow flex justify-center">
              <Skeleton className="h-9 w-72" />
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-gray-800 w-full bg-white p-4 rounded-lg shadow">
              {courseData?.title || "Frontend Dasturlash Kursi"}
            </h1>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow">
            {sectionsLoading || pageLoading ? (
              <SidebarSkeleton />
            ) : (
              <div className="space-y-2">
                {sections.map((section) => (
                  <div key={section.id}>
                    <div
                      className={`flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer ${
                        selectedSection?.id === section.id
                          ? "bg-blue-100 font-medium"
                          : ""
                      }`}
                      onClick={() => handleSectionClick(section)}
                    >
                      <PlayCircleFilled className="text-blue-500 mr-2" />
                      <span>{section.title}</span>
                    </div>

                    {expandedSection === section.id && (
                      <div className="ml-6 space-y-1">
                        {!topicsMap[section.id] ? (
                          <div className="space-y-1 py-1">
                            <Skeleton className="h-7 w-full rounded" />
                            <Skeleton className="h-7 w-4/5 rounded" />
                            <Skeleton className="h-7 w-3/5 rounded" />
                          </div>
                        ) : topicsMap[section.id].length === 0 ? (
                          <p className="text-xs text-gray-400 py-2 px-2">
                            Mavzular yo'q
                          </p>
                        ) : (
                          topicsMap[section.id].map((topic) => (
                            <div
                              key={topic.id}
                              className={`flex items-center p-2 hover:bg-blue-50 rounded cursor-pointer ${
                                selectedTopic?.id === topic.id
                                  ? "bg-blue-200 font-medium"
                                  : ""
                              }`}
                              onClick={() => handleTopicClick(topic)}
                            >
                              {topic.topic_type === "video" ? (
                                <PlayCircleFilled className="text-blue-400 mr-2 text-xs" />
                              ) : (
                                <CodeOutlined className="text-blue-400 mr-2 text-xs" />
                              )}
                              <span className="text-sm">{topic.title}</span>
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

          <div className="w-full lg:w-3/4">
          {
            
          }
            {!selectedTopic ? (
              <Card title="Darsni tanlang" className="mb-6 shadow">
                <div className="text-center py-8 text-gray-500">
                  Iltimos, chap menyudan darsni tanlang
                </div>
              </Card>
            ) : topicLoading ? (
              <ContentSkeleton />
            ) : topicDetail?.detail!=="Kurs yopiq. To'lov qiling." ? (
              <>
                <Card title={topicDetail.title} className="mb-6 shadow">
                  <div className="aspect-w-16 aspect-h-9 mb-4">
                    {getVimeoEmbedUrl(topicDetail?.video_url) ? (
                      <VimeoIframe url={getVimeoEmbedUrl(topicDetail.video_url)} />
                    ) : null}
                  </div>
                  
                  <div className="prose max-w-none">
                    {topicDetail.about && <p>{topicDetail.about}</p>}
                  </div>
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
                  <div className="space-x-2">
                    <Button
                      type="primary"
                      icon={<CheckCircleFilled />}
                      onClick={() => goToAdjacent(1)}
                      disabled={isLast}
                    >
                      Keyingi dars
                    </Button>
                  </div>
                </div>

                {topicDetail.topic_type === "code" && (
                  <div className="bg-white rounded-lg shadow overflow-hidden">

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
                )}
              </>
            ) : (
              <Card className="mb-6 shadow">
                <div className="text-center py-8 text-red-400">
                  Ko'zda tutilmagan muammo, iltimos kursni xarid qilganingizga ishonch xosil qiling !!!
                </div>
              </Card>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default FrontendCourse;