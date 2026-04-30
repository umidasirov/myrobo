import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../datacontect";
import { Button } from "antd";

export function toSlug(id, text) {
  if (!text) return String(id);
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
  const shortId = String(id).split("-")[0];
  return `${slug}--${shortId}`;
}

function SkeletonCard({ isSmall = false }) {
  return (
    <div
      className={`${
        isSmall ? "w-80" : "w-full"
      } group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col`}
    >
      <div className="h-[220px] overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
        <div className="w-full h-full animate-pulse bg-gray-200 dark:bg-gray-600" />
      </div>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-1 text-[12px]">
          <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse" />
          <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-[90%] rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
          <div className="h-4 w-[65%] rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
        </div>
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
          <div className="h-3 w-[92%] rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
          <div className="h-3 w-[72%] rounded bg-gray-100 dark:bg-gray-700 animate-pulse" />
        </div>
        <div className="mt-2">
          <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function KirishComponents() {
  const { data, fetchCourse } = useData();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [courseTypes, setCourseTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);
  const token = localStorage.getItem("token");
  const location = useLocation();

  useEffect(() => {
    const fetchCourseTypes = async () => {
      setTypesLoading(true);
      try {
        const res = await fetch("https://myrobo.uz/api/courses/course-types/", {
          headers: { "Content-Type": "application/json" },
        });
        const types = await res.json();
        setCourseTypes(types);
        if (location.pathname === "/kurslar") {
          const savedTypeId = sessionStorage.getItem("selectedCourseType");
          if (savedTypeId) {
            setSelected(new Set([savedTypeId]));
            sessionStorage.removeItem("selectedCourseType");
          }
        }
      } catch (err) {
      } finally {
        setTypesLoading(false);
      }
    };
    fetchCourseTypes();
  }, [location.pathname]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        await fetchCourse();
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (data && data.length > 0) {
      setAllCourses(data);
      setFilteredCourses(data);
    }
  }, [data]);

  const fetchBySelectedTypes = useCallback(
    async (typeIdSet) => {
      if (typeIdSet.size === 0) {
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          setFilteredCourses(
            allCourses.filter(
              (c) =>
                c?.title?.toLowerCase().includes(query) ||
                c?.about?.toLowerCase().includes(query)
            )
          );
        } else {
          setFilteredCourses(allCourses);
        }
        return;
      }
      setIsLoading(true);
      try {
        const results = await Promise.all(
          [...typeIdSet].map((typeId) =>
            fetch(
              `https://myrobo.uz/api/courses/course-types/${typeId}/courses/`,
              { headers: { "Content-Type": "application/json" } }
            ).then((r) => r.json())
          )
        );
        const merged = Object.values(
          results.flat().reduce((acc, c) => ({ ...acc, [c.id]: c }), {})
        );
        let filtered = merged;
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          filtered = merged.filter(
            (c) =>
              c?.title?.toLowerCase().includes(query) ||
              c?.about?.toLowerCase().includes(query)
          );
        }
        setFilteredCourses(filtered);
      } catch (err) {
      } finally {
        setIsLoading(false);
      }
    },
    [allCourses, searchQuery]
  );

  useEffect(() => {
    if (courseTypes.length > 0 && selected.size > 0) {
      fetchBySelectedTypes(selected);
    }
  }, [selected, courseTypes, fetchBySelectedTypes]);

  useEffect(() => {
    if (selected.size > 0) {
      fetchBySelectedTypes(selected);
    } else {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        setFilteredCourses(
          allCourses.filter(
            (c) =>
              c?.title?.toLowerCase().includes(query) ||
              c?.about?.toLowerCase().includes(query)
          )
        );
      } else {
        setFilteredCourses(allCourses);
      }
    }
  }, [searchQuery]);

  const handleSelect = (typeId) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(typeId) ? next.delete(typeId) : next.add(typeId);
      return next;
    });
  };

  const clearAll = () => {
    setSelected(new Set());
    setSearchQuery("");
    setFilteredCourses(allCourses);
  };

  const truncateText = (text = "", limit = 90) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };

  const postId = (title, id) => {
    const slug = toSlug(id, title);
    navigate(`/kurslar/${slug}`);
  };

  const displayedData =
    location.pathname !== "/kurslar"
      ? filteredCourses?.slice(0, 4)
      : filteredCourses;
  const courseCount = displayedData?.length || 0;
  const isSmallCount = courseCount < 3 && courseCount > 0;

  return (
    <section className="w-full md:w-[90%] m-auto mt-8 md:mt-[60px] px-4 md:px-0 mb-12">
      {/* Sarlavha - faqat bosh sahifada */}
      {location.pathname !== "/kurslar" && (
        <div className="mb-8 md:mb-10 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mashhur <span className="text-blue-500">kurslar</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Eng zamonaviy IT kurslarimizni o'rganing va o'z kelajagingizni biz
            bilan birga quring
          </p>
        </div>
      )}

      {/* Search & Filter - faqat /kurslar da */}
      {location.pathname === "/kurslar" && (
        <div className="mb-6 md:mb-8 flex flex-col gap-4 md:gap-6">
          {/* Search */}
          <div className="flex flex-col gap-3">
            {/* Desktop */}
            <div className="hidden md:flex gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Kurs nomi yoki tavsifini izlang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl
                           border border-gray-200 dark:border-gray-600
                           bg-white dark:bg-gray-800
                           text-gray-900 dark:text-white
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                           transition-all text-sm md:text-base"
              />
              {(searchQuery || selected.size > 0) && (
                <button
                  onClick={clearAll}
                  className="px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl text-xs md:text-sm font-medium text-red-400
                             border-[1.5px] border-red-100 dark:border-red-900/40
                             bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30
                             transition-all duration-200 whitespace-nowrap"
                >
                  Tozalash
                </button>
              )}
            </div>

            {/* Mobile */}
            <div className="flex md:hidden gap-2">
              {!isSearchOpen ? (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600
                             bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                             flex items-center justify-center gap-2
                             hover:border-blue-400 hover:text-blue-600 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm">Izlash</span>
                </button>
              ) : (
                <div className="flex gap-2 w-full">
                  <input
                    type="text"
                    autoFocus
                    placeholder="Kurs izlang..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600
                               bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                               placeholder-gray-400 dark:placeholder-gray-500
                               focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800
                               transition-all text-sm"
                  />
                  <button
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
                    className="px-3 py-2.5 rounded-lg border border-gray-200 dark:border-gray-600
                               text-gray-500 dark:text-gray-400
                               flex items-center justify-center
                               hover:border-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
            <div className="flex items-center gap-2">
              <div className="h-0.5 md:h-[2px] flex-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
              <span className="whitespace-nowrap text-sm md:text-base font-medium text-gray-800 dark:text-gray-200">
                Barcha kurslar
              </span>
            </div>
            <span className="text-xs md:text-sm text-gray-400 dark:text-gray-500">
              {filteredCourses.length} ta natija
            </span>
          </div>

          {/* Filters */}
          {typesLoading ? (
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
              {[80, 100, 70, 90, 75].map((w, i) => (
                <div
                  key={i}
                  className="h-7 md:h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 animate-pulse"
                  style={{ width: w }}
                />
              ))}
            </div>
          ) : courseTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
              <button
                onClick={clearAll}
                className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium border-[1.5px] transition-all duration-200 whitespace-nowrap
                  ${selected.size === 0 && searchQuery === ""
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600"
                  }`}
              >
                Barchasi
              </button>

              {courseTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.id)}
                  className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium border-[1.5px] transition-all duration-200 whitespace-nowrap
                    ${selected.has(type.id)
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:text-blue-600"
                    }`}
                >
                  {type.title}
                </button>
              ))}

              {selected.size > 0 && (
                <button
                  onClick={clearAll}
                  className="px-2 md:px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium text-red-400
                             border-[1.5px] border-red-100 dark:border-red-900/40
                             bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30
                             transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
                >
                  <span>×</span>
                  <span>Tozalash {selected.size}</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bo'sh holat */}
      {location.pathname === "/kurslar" && !isLoading && filteredCourses.length === 0 && (
        <div className="flex flex-col items-center py-24 gap-3 text-gray-400 dark:text-gray-500">
          <span className="text-5xl">📭</span>
          <p className="text-[15px] font-semibold text-gray-700 dark:text-gray-300 mt-1">
            Bu kriteriygada hech narsa topilmadi
          </p>
          <button
            onClick={clearAll}
            className="text-sm text-blue-500 underline underline-offset-4 hover:text-blue-700 transition-colors"
          >
            Filtrni tozalash
          </button>
        </div>
      )}

      {/* Kurs kartalar gridi */}
      <div
        className={
          isSmallCount
            ? "flex justify-center gap-4 md:gap-6 mb-8 flex-wrap"
            : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center md:justify-items-start mb-8"
        }
      >
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} isSmall={isSmallCount} />
            ))
          : displayedData?.map((value) => (
              <motion.div
                key={value?.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: false }}
                onClick={() => postId(value?.title, value?.id)}
                className={`${isSmallCount ? "w-80" : "w-full"} group bg-white dark:bg-gray-800
                  rounded-2xl overflow-hidden
                  border border-gray-100 dark:border-gray-700
                  shadow-sm cursor-pointer flex flex-col
                  hover:-translate-y-1 md:hover:-translate-y-2
                  hover:shadow-lg md:hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20
                  hover:border-blue-100 dark:hover:border-blue-700
                  transition-all duration-300`}
              >
                <div className="h-[220px] overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={value?.image}
                    alt={value?.title}
                  />
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2">
                  <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-[12px]">
                    <svg
                      className="text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#3b82f6"
                      width="16px"
                      height="16px"
                      viewBox="0 0 256 256"
                    >
                      <path d="M227.79492,52.61621l-96-32a11.98464,11.98464,0,0,0-7.58984,0L28.44678,52.53564l-.05078.01685-.19092.06372c-.17383.05786-.34107.12793-.51074.19312-.20118.07739-.40052.15722-.5962.24487-.24487.10962-.48706.22339-.72216.34814-.11817.06275-.23181.13233-.34766.199-.199.11426-.39526.23144-.58618.3562-.10938.07153-.21655.14551-.32361.2207q-.295.20655-.575.42993c-.09009.07154-.18091.14185-.26892.21607q-.33453.282-.64575.58691c-.04444.04346-.09192.0835-.13575.12744q-.37243.375-.70947.78077c-.06335.07592-.12109.15625-.18249.23364-.15516.1958-.30579.39453-.44837.59961-.07861.11279-.15332.22778-.228.34326q-.175.271-.33483.55127c-.07264.12671-.14551.25268-.21363.38257-.10583.20166-.20251.40844-.297.61645-.05225.115-.10987.22657-.15845.34351-.12842.30835-.24243.62353-.34522.94311-.04187.13086-.07544.2649-.113.39746-.06128.21656-.1189.43384-.16822.65455-.03125.14062-.05908.28222-.08545.4248-.04345.23462-.07861.47119-.10839.71-.01526.124-.03321.24732-.04468.37256C20.02209,63.2583,20,63.627,20,64v80a12,12,0,0,0,24,0V80.64868l23.7146,7.905a67.90093,67.90093,0,0,0,18.11377,84.73047,99.97006,99.97006,0,0,0-41.64819,36.16016,12.00007,12.00007,0,0,0,20.10351,13.10937,76.02217,76.02217,0,0,1,127.43213,0,12.00007,12.00007,0,0,0,20.10352-13.10937,99.97238,99.97238,0,0,0-41.64783-36.16016A67.9008,67.9008,0,0,0,188.2854,88.55371l39.50952-13.16992a11.99952,11.99952,0,0,0,0-22.76758ZM128,44.64941,186.05273,64l-20.70739,6.90234-.03272.011L128,83.35059,90.68677,70.91309l-.02844-.00953L69.94727,64ZM172,120A44,44,0,1,1,90.93738,96.29443l33.2677,11.08936a11.99358,11.99358,0,0,0,7.58984,0l33.2677-11.08936A43.87528,43.87528,0,0,1,172,120Z" />
                    </svg>
                    <span>{value?.buyers_total} o'quvchi</span>
                  </div>

                  <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                    {value?.title}
                  </h3>

                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
                    {truncateText(value?.about)}
                  </p>

                  <div className="mt-2">
                    {value?.price === 0 ||
                    value?.price === "0" ||
                    !value?.price ? (
                      <span className="text-[16px] font-bold text-blue-500">
                        Bepul
                      </span>
                    ) : (
                      <span className="text-[16px] font-bold text-blue-500">
                        {Number(value?.price).toLocaleString("uz-UZ")} so'm
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
      </div>

      {/* Barcha kurslarga o'tish tugmasi */}
      {location.pathname !== "/kurslar" && (
        <div className="flex justify-center">
          <button
            className="border-none mx-auto py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors duration-200"
            onClick={() => navigate("/kurslar")}
          >
            Barcha kurslarga o'tish
          </button>
        </div>
      )}
    </section>
  );
}

export default KirishComponents;
