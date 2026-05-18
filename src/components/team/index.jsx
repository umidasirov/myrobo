import { useEffect } from "react";
import { useData } from "../../datacontect";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="w-full max-w-[310px] rounded-2xl border border-gray-200 bg-white p-5 animate-pulse dark:border-gray-700 dark:bg-gray-900">
    <div className="overflow-hidden rounded-xl">
      <div className="h-[220px] w-full rounded-xl bg-gray-200 dark:bg-gray-700 md:h-[280px]" />
    </div>

    <div className="flex flex-col items-center gap-4 pt-5">
      <div className="h-[22px] w-[140px] rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-[16px] w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-[16px] w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1 h-[24px] w-[90px] rounded-full bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1 h-[40px] w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
);

const truncateText = (text = "", limit = 100) => {
  if (!text) return "";
  return text.length <= limit ? text : text.slice(0, limit).trim() + "...";
};

function TeamComponents() {
  const navigate = useNavigate();
  const { teacherData, fetchTeam, loading } = useData();

  const teachers = Array.isArray(teacherData) ? teacherData : [];
  const isSmall = teachers.length > 0 && teachers.length < 4;

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 35,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const postID = (slug) => {
    if (!slug) return;
    navigate(`/mentorlar/${slug}`);
  };

  return (
    <section className="relative mx-auto mb-16 mt-8 w-full px-4 md:mt-[140px] md:w-[90%] md:px-0">
      <div className="mb-8 text-center md:mb-12">
        <span className="mb-3 inline-flex rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
          Bizning mentorlar
        </span>

        <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
          Professional{" "}
          <span className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
            o'qituvchilar
          </span>{" "}
          jamoasi
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-gray-600 dark:text-gray-400 md:text-base">
          Tajribali va malakali o'qituvchilardan to'g'ridan-to'g'ri o'rganing
        </p>
      </div>

      <div
        className={
          isSmall
            ? "flex flex-wrap justify-center gap-6"
            : "grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        }
      >
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : teachers.length > 0 ? (
          teachers.map((value, index) => {
            const fullName =
              value?.username ||
              `${value?.first_name || ""} ${value?.last_name || ""}`.trim() ||
              "Mentor";

            const image = value?.image || value?.img;
            const about = value?.about || value?.job || "";
            const courseCount = value?.courses_count || 0;

            return (
              <motion.div
                key={value?.slug || value?.id || index}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                onClick={() => postID(value?.slug)}
                className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:border-gray-700/80 dark:bg-gray-900 dark:hover:border-blue-400/40 dark:hover:shadow-blue-400/10 ${
                  isSmall ? "w-80" : "w-full max-w-[330px]"
                }`}
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  {image ? (
                    <img
                      className="h-[220px] w-full rounded-xl object-cover transition-transform duration-700 ease-out group-hover:scale-110 md:h-[280px]"
                      src={image}
                      alt={fullName}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-[220px] w-full items-center justify-center rounded-xl bg-gray-100 text-sm text-gray-400 dark:bg-gray-800 dark:text-gray-500 md:h-[280px]">
                      Rasm yo'q
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 pt-5">
                  <h2 className="text-center text-[17px] font-bold text-gray-900 transition-colors duration-300 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 md:text-[20px]">
                    {fullName}
                  </h2>

                  {/* <p className="min-h-[54px] text-center text-xs leading-relaxed text-gray-500 dark:text-gray-400 md:text-sm">
                    {truncateText(about, 100)}
                  </p> */}

                  <div className="flex justify-center">
                    <span className="rounded-full border border-blue-200 bg-blue-100 px-3 py-1 text-xs font-medium text-blue-600 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
                      {courseCount} ta kurs
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      postID(value?.slug);
                    }}
                    className="mt-auto w-full rounded-xl border border-blue-500 bg-transparent py-2.5 text-xs font-semibold text-blue-500 transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-lg hover:shadow-blue-500/30 dark:text-blue-400 dark:hover:text-white md:text-sm"
                  >
                    Batafsil ko'rish
                  </button>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Ma'lumotlar topilmadi
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default TeamComponents;