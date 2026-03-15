import { useEffect } from "react";
import { useData } from "../../datacontect";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    fetchTeam();
  }, []);

  const postID = (slug) => {
    localStorage.setItem("location", slug);
    navigate("/team2/");
  };

  return (
    <section className="w-[90%] mx-auto mt-[140px] mb-11 max-w-[1200px] max-[768px]:mt-[80px] max-[568px]:mt-[40px]">
      <div className="flex flex-col gap-[60px] items-center max-[768px]:gap-[35px]">
        <h1 className="text-[35px] font-bold text-center max-[768px]:text-[29px] max-[640px]:text-[24px] max-[480px]:text-[21px]">
          Professional{" "}
          <span className="text-blue-600">o'qituvchilar</span> jamoasi
        </h1>

        <div className="w-full">
          {loading ? (
            <div className="flex justify-center gap-6 flex-wrap">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <div className="flex justify-center gap-6 flex-wrap">
              {teacherData?.map((value, index) => (
                <div
                  key={value.slug}
                  onClick={() => postID(value?.slug)}
                  className="border border-gray-200 w-full max-w-[310px] p-6 rounded-xl hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      className="w-full h-[280px] object-cover hover:scale-105 transition-transform duration-300"
                      src={value?.img}
                      alt={value?.username}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-5 flex-1">
                    <h2 className="text-[20px] font-bold text-center max-[568px]:text-[18px]">
                      {value?.username}
                    </h2>

                    <p className="text-gray-500 text-sm leading-relaxed text-center line-clamp-3">
                      {value?.description || getDescription(index)}
                    </p>

                    <div className="flex justify-center mt-1">
                      <span className="text-xs text-blue-400 bg-blue-100 px-3 py-1 rounded-full">
                        {value.courses.length} ta kurs
                      </span>
                    </div>

                    <button
                      className="w-full mt-auto py-2 rounded-lg border border-blue-500 text-blue-500 text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors duration-200"
                    >
                      Batafsil ko'rish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default TeamComponents;
