import { useEffect } from "react";
import { useData } from "../../datacontect";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SkeletonCard = () => (
  <div className="border border-gray-200 w-full max-w-[310px] p-6 rounded-lg animate-pulse">
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

const PLACEHOLDER_DESCRIPTIONS = [
  "Full-stack dasturchi va mentor. O'quvchilarga amaliy loyihalar orqali bilim beradi.",
  "Frontend dasturlash bo'yicha 5 yillik tajribaga ega mutaxassis. React va modern veb texnologiyalarini o'rgatadi.",
  "Python va backend texnologiyalari bo'yicha tajribali dasturchi. Murakkab tizimlarni sodda tushuntiradi.",
  "UI/UX va frontend yo'nalishida faol ishlovchi dasturchi. Zamonaviy dizayn trendlarini o'rgatadi.",
  "Mobile dasturlash va React Native bo'yicha mutaxassis. Ko'plab tayyor ilovalar muallifi.",
  "DevOps va cloud texnologiyalari bo'yicha tajribali muhandis. CI/CD va deployment jarayonlarini o'rgatadi.",
];

function getDescription(index) {
  return PLACEHOLDER_DESCRIPTIONS[index % PLACEHOLDER_DESCRIPTIONS.length];
}

function TeamComponents() {
  const navigate = useNavigate();
  const { teacherData, fetchTeam, loading } = useData();

  // Animation variants
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
    localStorage.setItem("location", slug);
    navigate("/team2/");
  };
  
  return (
    <section className="w-full md:w-[90%] m-auto mt-8 md:mt-[140px] px-4 md:px-0 mb-16">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Professional <span className="text-blue-600">o'qituvchilar</span> jamoasi
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          Tajribali va malakali o'qituvchilardan to'g'ridan-to'g'ri o'rganing
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center md:justify-items-start">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : teacherData?.map((value, index) => (
            <motion.div
              key={value.slug}
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              onClick={() => postID(value?.slug)}
              className="w-full bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col hover:scale-105 transform duration-300"
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

                <p className="text-gray-500 text-xs md:text-sm leading-relaxed text-center line-clamp-3">
                  {value?.about || getDescription(index)}
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
          ))}
      </div>
    </section>
  );
}

export default TeamComponents;
