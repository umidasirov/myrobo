import { useData } from "../../datacontect";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toSlug } from "../kirish";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Users } from "lucide-react";
import { Helmet } from "react-helmet-async";

const SkeletonProfile = () => (
  <div className="w-[92%] max-w-6xl m-auto p-6 md:p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-xl mt-[80px] md:mt-[100px] animate-pulse border border-gray-100 dark:border-gray-800">
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
      <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
      <div className="flex-1 w-full space-y-4">
        <div className="h-8 w-1/2 md:w-1/3 rounded bg-gray-200 dark:bg-gray-800 mx-auto md:mx-0" />
        <div className="h-4 w-1/3 md:w-1/4 rounded bg-gray-200 dark:bg-gray-800 mx-auto md:mx-0" />
        <div className="space-y-2 pt-2">
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-4 w-5/6 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  </div>
);

const truncateText = (text = "", limit = 85) => {
  if (!text) return "";
  return text.length <= limit ? text : text.slice(0, limit).trim() + "...";
};

export default function Team2() {
  const { mentorData, fetchTeachers, fetchCourse, data, loading } = useData();
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    fetchTeachers(slug);
    fetchCourse();
  }, [slug]);

  const profile = mentorData;

  const mentorCourseSlugs = Array.isArray(profile?.courses)
    ? profile.courses.map((c) => c?.slug)
    : [];

  const courses = Array.isArray(data) ? data : [];

  const courseTeacher = courses.filter((course) =>
    mentorCourseSlugs.includes(course?.slug)
  );

  const displayCourses = courseTeacher.length > 0 ? courseTeacher : (Array.isArray(profile?.courses) ? profile.courses : []);

  const fullName =
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() ||
    profile?.username ||
    "Mentor";

  const totalStudents = displayCourses.reduce(
    (sum, course) => sum + Number(course?.buyers_total || 0),
    0
  );

  const postId = (title, id) => {
    if (!title) return;
    if (id) localStorage.setItem("locate", id);
    navigate(`/kurslar/${toSlug(title)}`);
  };

  if (loading || !profile) return <SkeletonProfile />;
  
  return (
    <>
      <Helmet>
        <title>{`${fullName} - MyRobo`}</title>
        <meta name="description" content={profile?.about || "MyRobo mentori haqida ma'lumot."} />
        <meta name="keywords" content={`mentor, ${profile?.username || ""}, ${profile?.direction || ""}, MyRobo`} />
        <meta property="og:title" content={`${fullName} - MyRobo`} />
        <meta property="og:description" content={profile?.about || "MyRobo mentori haqida ma'lumot."} />
        <meta property="og:image" content={profile?.image || ""} />
        <meta property="og:type" content="profile" />
      </Helmet>

      <div className="w-[92%] max-w-7xl m-auto mt-[80px] md:mt-[120px] mb-16 md:mb-24 font-sans selection:bg-blue-500 selection:text-white">
        
        {/* Mentor Asosiy Karta */}
        <div className="relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-gray-100/80 bg-white p-5 shadow-xl shadow-blue-100/30 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none md:p-10 lg:p-12">
          {/* Orqa fondagi effektlar - mobil ekranlarda xalaqit bermasligi uchun moslangan */}
          <div className="absolute right-0 top-0 h-48 w-44 rounded-full bg-blue-100/60 blur-3xl dark:bg-blue-500/5 -mr-16 -mt-16 md:h-64 md:w-64" />
          <div className="absolute left-0 bottom-0 h-36 w-36 rounded-full bg-cyan-100/40 blur-2xl dark:bg-cyan-500/5 -ml-10 -mb-10" />

          <div className="relative flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
            
            {/* Profil Rasmi */}
            <div className="h-36 w-36 sm:h-40 sm:w-40 md:h-44 md:w-44 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 shadow-md ring-4 ring-gray-100 dark:bg-gray-800 dark:ring-gray-800/50">
              {profile?.image ? (
                <img
                  src={profile.image}
                  alt={fullName}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-gray-400 dark:text-gray-600">
                  Rasm yo'q
                </div>
              )}
            </div>

            {/* Profil Ma'lumotlari */}
            <div className="flex-1 w-full text-center md:text-left">
              <div className="flex flex-col justify-between items-center gap-3 md:flex-row md:items-start lg:items-center">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
                    {fullName}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <p className="text-base font-semibold text-blue-600 dark:text-blue-400">
                      {profile?.direction || profile?.job || "Mentor"}
                    </p>
                    <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                    <p className="text-sm font-medium text-gray-400 dark:text-gray-500">
                      @{profile?.username}
                    </p>
                  </div>
                </div>

                <span className="inline-block rounded-xl border border-blue-100/70 bg-blue-50/50 px-4 py-1.5 text-xs font-bold text-blue-700 dark:border-blue-500/10 dark:bg-blue-500/5 dark:text-blue-400 md:text-sm">
                  {profile?.experience || 0} yillik tajriba
                </span>
              </div>

              {/* Mentor haqida matn */}
              <div className="mt-6 md:mt-8">
                <h3 className="mb-2 text-xs font-extrabold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Mentor haqida
                </h3>
                <p className="max-w-3xl whitespace-pre-line text-base md:text-lg font-medium italic leading-relaxed text-gray-600 dark:text-gray-300">
                  "{profile?.about || "Ma'lumot mavjud emas"}"
                </p>
              </div>

              {/* Mini Kartalar (Grid) */}
              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 md:gap-4">
                
                {/* Ish joyi */}
                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100/60 bg-gray-50/50 p-3.5 dark:border-gray-800/60 dark:bg-gray-800/30">
                  <div className="rounded-lg bg-white p-2.5 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    <Briefcase size={18} className="text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Ish joyi</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 line-clamp-1">{profile?.work_place || "Ko'rsatilmagan"}</p>
                  </div>
                </div>

                {/* O'quvchilar */}
                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100/60 bg-gray-50/50 p-3.5 dark:border-gray-800/60 dark:bg-gray-800/30">
                  <div className="rounded-lg bg-white p-2.5 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    <Users size={18} className="text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">O'quvchilar</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{totalStudents} ta</p>
                  </div>
                </div>

                {/* Kurslar soni */}
                <div className="flex items-center gap-3.5 rounded-xl border border-gray-100/60 bg-gray-50/50 p-3.5 dark:border-gray-800/60 dark:bg-gray-800/30">
                  <div className="rounded-lg bg-white p-2.5 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-900">
                    <GraduationCap size={18} className="text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Kurslar soni</p>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{displayCourses.length} ta</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Kurslar qismi */}
        <section className="mt-14 md:mt-20">
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h2 className="mb-2 text-2xl font-black text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
              Mentor{" "}
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
                kurslari
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {fullName} tomonidan olib boriladigan professional o'quv dasturlari
            </p>
            <div className="mt-3 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto md:mx-0" />
          </div>

          {displayCourses.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-16 text-center dark:border-gray-800 dark:bg-gray-900/50">
              <GraduationCap size={36} className="mx-auto mb-3 text-gray-300 dark:text-gray-700" />
              <p className="text-base font-semibold text-gray-400 dark:text-gray-500">
                Hozircha faol kurslar mavjud emas
              </p>
            </div>
          ) : (
            // Grid responsivligi yaxshilandi (mobil ekranlarda ham chiroyli markazlashadi va paddinglar joyida qoladi)
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:justify-items-stretch">
              {displayCourses.map((value, index) => (
                <motion.div
                  key={value?.id || value?.slug || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  viewport={{ once: true, margin: "-40px" }}
                  onClick={() => postId(value?.title, value?.id)}
                  className="group flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-100/70 bg-white shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/5 dark:border-gray-800 dark:bg-gray-900"
                >
                  {/* Kurs rasmi */}
                  <div className="relative h-[160px] sm:h-[170px] md:h-[180px] flex-shrink-0 overflow-hidden bg-gray-50 dark:bg-gray-800/50">
                    {value?.image ? (
                      <img
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        src={value.image}
                        alt={value?.title || "Kurs"}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400 dark:text-gray-600">
                        Rasm mavjud emas
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Karta tarkibi */}
                  <div className="flex flex-1 flex-col p-4">
                    <div className="h-[3px] w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mb-3" />

                    {/* O'quvchilar soni */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2">
                      <Users size={13} className="text-blue-500/80" />
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {value?.buyers_total || 0}
                      </span>
                      <span>o'quvchi</span>
                    </div>

                    {/* Kurs nomi */}
                    <h3 className="line-clamp-2 text-sm font-extrabold leading-snug text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 md:text-base">
                      {value?.title || "Kurs nomi"}
                    </h3>

                    {/* Kurs haqida */}
                    <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                      {truncateText(value?.about || value?.title)}
                    </p>

                    {/* Narxi va O'tish tugmasi */}
                    <div className="mt-4 border-t border-gray-50 pt-3 dark:border-gray-800/80">
                      <div className="flex items-center justify-between">
                        {value?.price === 0 || value?.price === "0" || !value?.price ? (
                          <span className="rounded-lg bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600 dark:bg-green-500/10 dark:text-green-400">
                            Bepul
                          </span>
                        ) : (
                          <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                            {Number(value?.price).toLocaleString("uz-UZ")} so'm
                          </span>
                        )}

                        <span className="text-sm font-bold text-gray-300 transition-all group-hover:translate-x-1 group-hover:text-blue-500 dark:text-gray-600 dark:group-hover:text-blue-400">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}