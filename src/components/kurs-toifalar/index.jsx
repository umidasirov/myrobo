import { useEffect, useState } from "react";
import { useAxios } from "../../hooks";
import { useNavigate } from "react-router-dom";

function KursToifalariComponents() {
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    setLoad(true);
    try {
      const response = await fetch("https://myrobo.uz/api/courses/course-types/");
      const data = await response.json();
      setData(data);
    } catch (error) {
      
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    sessionStorage.setItem('selectedCourseType', categoryId);
    navigate('/kurslar');
  };

  return (
    <section className="bg-[#f1f2f7] dark:bg-gray-900 py-[40px] mt-[60px] bgnone transition-colors duration-300">
      <div className="w-[90%] m-auto">
        <div className="flex flex-col items-center gap-[20px] bgBlock max-[768px]:shadow-md dark:py-[40px] max-[768px]:shadow-blue-300  dark:max-[768px]:shadow-blue-900/30">
          <h3 className="text-[17px] text-gray-500 dark:text-gray-400">
            BULARDAN HAR QANDAY TANLANG
          </h3>
          <h2 className="text-[28px] font-bold dark:text-white">
            Kurslar <span className="text-blue-600">Toifalari</span>
          </h2>
          <div className="flex items-center gap-5 flex-wrap max-[440px]:grid max-[440px]:grid-cols-2 max-[440px]:gap-3 max-[440px]:w-full">
            {load
              ? Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-fit p-3 bg-white dark:bg-gray-800 text-[17px] rounded-md shadow-md shadow-blue-300 dark:shadow-blue-900/30 max-[440px]:w-full max-[440px]:text-center cursor-pointer animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-24 mb-2"></div>
                  </div>
                ))
              : data?.map((value) => (
                  <div
                    key={value?.id}
                    className="w-fit p-3 bg-white dark:bg-gray-800 text-[17px] text-gray-800 dark:text-gray-200 rounded-md shadow-md shadow-blue-300 dark:shadow-blue-900/30 max-[440px]:w-full max-[440px]:text-center cursor-pointer hover:transform hover:scale-105 transition-all border border-transparent dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                    onClick={() => handleCategoryClick(value?.id)}
                  >
                    <h4>{value?.title}</h4>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default KursToifalariComponents;
