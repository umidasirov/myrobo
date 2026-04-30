import { useEffect } from "react";
import { useData } from "../../datacontect";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="border border-gray-200 dark:border-gray-600 w-full max-w-[310px] p-6 rounded-lg animate-pulse">
    <div className="overflow-hidden rounded-lg">
      <div className="w-full h-[280px] bg-gray-200" />
    </div>
    <div className="flex flex-col items-center gap-4 pt-5">
      <div className="w-[140px] h-[22px] bg-gray-200 rounded" />
      <div className="w-full h-[16px] bg-gray-200 rounded" />
      <div className="w-4/5 h-[16px] bg-gray-200 rounded" />
      <div className="w-full flex justify-between mt-2">
        <div className="w-[80px] h-[16px] bg-gray-200 rounded" />
        <div className="w-[80px] h-[16px] bg-gray-200 rounded" />
      </div>
      <div className="w-full h-[36px] bg-gray-200 rounded-lg mt-1" />
    </div>
  </div>
);
const truncateText = (text = "", limit = 90) => {
  if (!text) return "";
  return text.length <= limit ? text : text.slice(0, limit).trim() + "...";
};
function TeamComponents() {
  const navigate = useNavigate();
  const { teacherData, fetchTeam, loading } = useData();

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -60 
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const postID = (slug) => {
    navigate(`/mentorlar/${slug}`);
  };
  const isSmall = Array.isArray(teacherData) && teacherData?.length < 4 && teacherData?.length > 0;
  return (
    <section className="w-full md:w-[90%] m-auto mt-8 md:mt-[140px] px-4 md:px-0 mb-16">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Professional <span className="text-blue-600">o'qituvchilar</span> jamoasi
        </h1>
        <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 text-sm md:text-base">
          Tajribali va malakali o'qituvchilardan to'g'ridan-to'g'ri o'rganing
        </p>
      </div>

      <div className={`${isSmall ? "flex flex-wrap justify-center":"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center md:justify-items-start"} `}>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : Array.isArray(teacherData) && teacherData?.length > 0 ? teacherData.map((value, index) => (
            <motion.div
              key={value.slug}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onClick={() => postID(value?.slug)}
              className={isSmall? "w-80 shadow-lg p-4 rounded-xl": `w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col hover:scale-105 transform duration-300`}
            >
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  className="w-full h-[220px] md:h-[280px] object-cover hover:scale-105 transition-transform duration-300"
                  src={value?.img}
                  alt={value?.username}
                  loading="lazy"
                />
              </div>

              <div className="flex flex-col gap-3 flex-1">
                <h2 className="text-[16px] md:text-[18px] lg:text-[20px] font-bold text-center">
                  {value?.username}
                </h2>

                <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-xs md:text-sm leading-relaxed text-center line-clamp-3">
                 {truncateText(value?.about, 100)}
                </p>

                <div className="flex justify-center mt-1">
                  <span className="text-xs text-blue-400 bg-blue-100 px-3 py-1 rounded-full">
                    {value.courses.length} ta kurs
                  </span>
                </div>

                <button
                  className="w-full mt-auto py-2 rounded-lg border border-blue-500 text-blue-500 text-xs md:text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200"
                >
                  Batafsil ko'rish
                </button>
              </div>
            </motion.div>
          ))
          : (
            // <div className="col-span-full flex flex-col items-center justify-center py-12">
            //   <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-lg">Ma'lumotlar topilmadi</p>
            // </div>
            <div></div>
          )}
      </div>
    </section>
  );
}

export default TeamComponents;
