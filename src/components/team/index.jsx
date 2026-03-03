import { Button } from "antd";
import { useAxios } from "../../hooks";
import { useEffect, useState } from "react";
import { useData } from "../../datacontect";
import { useNavigate } from "react-router-dom";

// Skeleton Loader Component
const SkeletonCard = () => {
  return (
    <div className="border border-gray-200 w-full max-w-[310px] p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer animate-pulse">
      <div className="overflow-hidden rounded-lg">
        <div className="w-full h-[280px] bg-gray-300"></div>
      </div>
      <div className="flex flex-col items-center gap-4 pt-5">
        <div className="w-[120px] h-[20px] bg-gray-300 rounded"></div>
        <div className="w-[150px] h-[20px] bg-gray-300 rounded mt-2"></div>
        <div className="w-full flex flex-col gap-4 mt-5">
          <div className="h-[20px] w-[60px] bg-gray-300 rounded"></div>
          <div className="h-[20px] w-[60px] bg-gray-300 rounded mt-2"></div>
        </div>
      </div>
    </div>
  );
};

function TeamComponents() {
  const navigate = useNavigate();
  const { teacherData, fetchTeam, loading } = useData();

  useEffect(() => {
    fetchTeam();
  }, []);

  const postID = (slug) => {
    localStorage.setItem('location', slug);
    navigate('/team2/');
  };

  const cardCount = teacherData?.length || 0;
  
  return (
    <section className="w-[90%] mx-auto mt-[140px] mb-11 max-w-[1200px] max-[768px]:mt-[80px] max-[568px]:mt-[40px]">
      <div className="flex flex-col gap-[60px] items-center max-[768px]:gap-[35px]">
        <h1 className="text-[35px] font-bold text-center max-[768px]:text-[29px] max-[640px]:text-[24px] max-[480px]:text-[21px]">
          Professional <span className="text-blue-600">o'qtuvchilar</span> jamoasi
        </h1>

        <div className="w-full">
          {loading ? (
            <div className={`flex justify-center gap-6 flex-wrap`}>
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : cardCount <= 2 ? (
            <div className={`flex justify-center gap-6 flex-wrap`}>
              {teacherData?.map((value) => (
                <div
                  key={value.slug}
                  onClick={() => postID(value?.slug)}
                  className="border border-gray-200 w-full max-w-[310px] p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      className="w-full h-[280px] object-cover hover:scale-105 transition-transform"
                      src={value?.img}
                      alt={value?.username}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4 pt-5">
                    <h2 className="text-[22px] font-bold text-center max-[568px]:text-[19px]">
                      {value?.username}
                    </h2>
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex justify-between gap-3">
                        <p className="text-gray-500">
                          Courses{" "}
                          <span className="font-medium text-black">{value.courses.length}</span>
                        </p>
                        <p className="text-gray-500">
                          Student{" "}
                          <span className="font-medium text-black">17</span>
                        </p>
                      </div>
                      <Button className="w-full">Batafsil ko'rish</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {teacherData?.map((value) => (
                <div
                  key={value.slug}
                  onClick={() => postID(value?.slug)}
                  className={`border border-gray-200 w-full max-w-[310px] p-6 rounded-lg hover:shadow-lg transition-shadow cursor-pointer ${
                    cardCount % 4 !== 0 &&
                    teacherData.indexOf(value) >= Math.floor(cardCount / 4) * 4
                      ? "sm:mx-auto lg:col-span-1 lg:col-start-2"
                      : "mx-auto"
                  }`}
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      className="w-full h-[280px] object-cover hover:scale-105 transition-transform"
                      src={value?.img}
                      alt={value?.username}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-col items-center gap-4 pt-5">
                    <h2 className="text-[22px] font-bold text-center max-[568px]:text-[19px]">
                      {value?.username}
                    </h2>
                    <div className="w-full flex flex-col gap-4">
                      <div className="flex justify-between gap-3">
                        <p className="text-gray-500">
                          Course
                          <span className="font-medium text-black">{value.courses.length}</span>{" "}
                        </p>
                        {/* <p className="text-gray-500">
                          <span className="font-medium text-black">17</span>{" "}
                          Student
                        </p> */}
                      </div>
                      <Button className="w-full">Batafsil ko'rish</Button>
                    </div>
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