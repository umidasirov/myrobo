import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useData } from "../../datacontect";

// ✅ Backward compatibility uchun saqlanadi — boshqa fayllar import qilishi mumkin
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

// ─── SkeletonCard ────────────────────────────────────────────────────────────
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
        </div>
        <div className="mt-2">
          <div className="h-5 w-24 rounded bg-gray-200 dark:bg-gray-600 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ─── KirishComponents ────────────────────────────────────────────────────────
function KirishComponents() {
  const { data, fetchCourse } = useData();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoading, setIsLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [courseTypes, setCourseTypes] = useState([]);
  const [typesLoading, setTypesLoading] = useState(false);

  // ── Course types ni yuklash ────────────────────────────────────────────────
  useEffect(() => {
    const fetchCourseTypes = async () => {
      setTypesLoading(true);
      try {
        const res = await fetch(
          "https://myrobo.adxamov.uz/courses/courses/course-types/",
          { headers: { "Content-Type": "application/json" } }
        );
        const types = await res.json();
        // Paginated bo'lsa results ni ol, aks holda to'g'ridan massiv
        setCourseTypes(Array.isArray(types) ? types : types.results ?? []);

        if (location.pathname === "/kurslar") {
          const savedTypeId = sessionStorage.getItem("selectedCourseType");
          if (savedTypeId) {
            setSelected(new Set([savedTypeId]));
            sessionStorage.removeItem("selectedCourseType");
          }
        }
      } catch (err) {
        console.error("Course types xatosi:", err);
      } finally {
        setTypesLoading(false);
      }
    };
    fetchCourseTypes();
  }, [location.pathname]);

  // ── Kurslarni yuklash ──────────────────────────────────────────────────────
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

  // ── data (context) o'zgarganda local state ga ko'chir ─────────────────────
  useEffect(() => {
    // fetchCourse → setData(response.data.results) bo'lishi kerak (datacontext.js)
    // Agar hali o'zgartirmagan bo'lsangiz: Array bo'lsa to'g'ri, object bo'lsa results ni ol
    const courses = Array.isArray(data)
      ? data
      : (data?.results ?? []);

    if (courses.length > 0) {
      setAllCourses(courses);
      setFilteredCourses(courses);
    }
  }, [data]);

  // ── Tanlangan turlar bo'yicha filter ──────────────────────────────────────
  const fetchBySelectedTypes = useCallback(
    async (typeIdSet) => {
      if (typeIdSet.size === 0) {
        applySearch(allCourses, searchQuery);
        return;
      }
      setIsLoading(true);
      try {
        const results = await Promise.all(
          [...typeIdSet].map((typeId) =>
            fetch(
              `https://myrobo.adxamov.uz/courses/courses/course-types/${typeId}/courses/`,
              { headers: { "Content-Type": "application/json" } }
            ).then((r) => r.json())
          )
        );

        // Har bir natija paginated yoki massiv bo'lishi mumkin
        const flat = results.flatMap((r) =>
          Array.isArray(r) ? r : (r?.results ?? [])
        );

        // slug bo'yicha deduplicate
        const merged = Object.values(
          flat.reduce((acc, c) => ({ ...acc, [c.slug]: c }), {})
        );
        applySearch(merged, searchQuery);
      } catch (err) {
        console.error("Type filter xatosi:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [allCourses, searchQuery]
  );

  const applySearch = (courses, query) => {
    if (!query.trim()) {
      setFilteredCourses(courses);
      return;
    }
    const q = query.toLowerCase();
    setFilteredCourses(
      courses.filter(
        (c) =>
          c?.title?.toLowerCase().includes(q) ||
          c?.course_type?.title?.toLowerCase().includes(q)
      )
    );
  };

  useEffect(() => {
    if (courseTypes.length > 0 && selected.size > 0) {
      fetchBySelectedTypes(selected);
    }
  }, [selected, courseTypes, fetchBySelectedTypes]);

  useEffect(() => {
    if (selected.size > 0) {
      fetchBySelectedTypes(selected);
    } else {
      applySearch(allCourses, searchQuery);
    }
  }, [searchQuery]);

  // ── Handlers ──────────────────────────────────────────────────────────────
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

  // ── Navigatsiya: endi slug ishlatiladi ────────────────────────────────────
  const goToCourse = (slug) => {
    navigate(`/kurslar/${slug}`);
  };

  // ── Ko'rsatiladigan ma'lumotlar ───────────────────────────────────────────
  const displayedData =
    location.pathname !== "/kurslar"
      ? filteredCourses?.slice(0, 4)
      : filteredCourses;

  const courseCount = displayedData?.length || 0;
  const isSmallCount = courseCount < 3 && courseCount > 0;

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <section className="w-full md:w-[90%] m-auto mt-8 md:mt-[60px] px-4 md:px-0 mb-12">

      {/* Sarlavha — faqat bosh sahifada */}
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

      {/* Search & Filter — faqat /kurslar da */}
      {location.pathname === "/kurslar" && (
        <div className="mb-6 md:mb-8 flex flex-col gap-4 md:gap-6">

          {/* Search */}
          <div className="flex flex-col gap-3">
            {/* Desktop */}
            <div className="hidden md:flex gap-3 md:gap-4">
              <input
                type="text"
                placeholder="Kurs nomi yoki kategoriyasini izlang..."
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
            Bu kriteriyada hech narsa topilmadi
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
          : displayedData?.map((course) => (
              <motion.div
                key={course?.slug}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: false }}
                onClick={() => goToCourse(course?.slug)}
                className={`${isSmallCount ? "w-80" : "w-full"} group bg-white dark:bg-gray-800
                  rounded-2xl overflow-hidden
                  border border-gray-100 dark:border-gray-700
                  shadow-sm cursor-pointer flex flex-col
                  hover:-translate-y-1 md:hover:-translate-y-2
                  hover:shadow-lg md:hover:shadow-xl hover:shadow-blue-100 dark:hover:shadow-blue-900/20
                  hover:border-blue-100 dark:hover:border-blue-700
                  transition-all duration-300`}
              >
                {/* Rasm */}
                <div className="h-[220px] overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={course?.image}
                    alt={course?.title}
                  />
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2">

                  {/* Kategoriya badge */}
                  {course?.course_type?.title && (
                    <div className="flex items-center gap-1 text-[12px] text-gray-400 dark:text-gray-500">
                      <svg
                        className="text-blue-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#3b82f6"
                        width="14px"
                        height="14px"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
                      </svg>
                      <span className="capitalize">{course?.course_type?.title}</span>
                    </div>
                  )}

                  {/* Sarlavha */}
                  <h3 className="text-[15px] font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
                    {course?.title}
                  </h3>

                  {/* O'qituvchilar */}
                  {course?.teachers?.length > 0 && (
                    <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 flex-1">
                      O'qituvchi:{" "}
                      {course.teachers
                        .map((t) => t?.full_name || t?.username || t)
                        .join(", ")}
                    </p>
                  )}

                  {/* Narx */}
                  <div className="mt-2">
                    {!course?.price ||
                    course?.price === "0" ||
                    course?.price === "0.00" ? (
                      <span className="text-[16px] font-bold text-blue-500">
                        Bepul
                      </span>
                    ) : (
                      <span className="text-[16px] font-bold text-blue-500">
                        {Number(course?.price).toLocaleString("uz-UZ")} so'm
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