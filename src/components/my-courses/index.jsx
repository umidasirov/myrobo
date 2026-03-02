import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { CheckCircleFilled } from "@ant-design/icons";

function MeningKurslarim() {
  const [activeCard, setActiveCard] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch("https://api.myrobo.uz/courses/my-courses/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setData(data))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false));
  }, []);

  const truncateDescription2 = (text = "", limit = 27) => {
    const words = text.split(" ");
    return words.slice(0, limit).join(" ") + (words.length > limit ? "..." : "");
  };

  if (loading) {
    return (
      <section className="w-[90%] m-auto max-[768px]:mt-[30px]">
        <h1 className="text-center py-[40px] font-bold text-[22px] max-[768px]:py-[20px]">
          Mening kurslarim
        </h1>
        <div className="flex flex-wrap justify-center gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-[300px] h-[400px] rounded-lg overflow-hidden shadow-lg bg-white">
              <div className="h-[180px] bg-gray-200 animate-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse mt-4" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 w-28 bg-gray-200 rounded-full animate-pulse mt-6" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-[90%] m-auto max-[768px]:mt-[30px]">
      <div>
        <h1 className="text-center py-[40px] font-bold text-[22px] max-[768px]:py-[20px]">
          Mening kurslarim
        </h1>
        <div className="flex flex-wrap justify-center gap-8">
          {data?.length > 0 ? (
            data.map((value) => (
              <div
                key={value?.id}
                className="relative w-[300px] h-[400px] rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
                onMouseEnter={() => setActiveCard(value?.id)}
                onMouseLeave={() => setActiveCard(null)}
              >
                <div className="h-full flex flex-col">
                  <div className="h-[180px] overflow-hidden relative">
                    <img
                      className="w-full h-full object-cover"
                      src={value?.image}
                      alt={value?.title}
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                      <CheckCircleFilled />
                      <span>Sotib olingan</span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col bg-white">
                    <div className="flex items-center mb-2">
                      <div className="w-4 h-4 bg-blue-100 rounded-full mr-2"></div>
                      <span className="text-blue-600 font-medium">{value?.price} so'm</span>
                    </div>
                    <h3 className="text-lg font-bold mb-3 line-clamp-2">
                      {value?.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-auto line-clamp-2">
                      {value?.about}
                    </p>
                  </div>
                </div>

                <AnimatePresence>
                  {activeCard === value?.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0 bg-white p-5 flex flex-col z-10 shadow-2xl"
                    >
                      <div className="mb-3 p-2 bg-blue-50 rounded-md">
                        <h3 className="text-lg font-bold text-center">
                          {value?.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 rounded-lg py-2 mb-3">
                        <CheckCircleFilled className="text-green-500 text-base" />
                        <span className="text-green-600 font-semibold text-sm">Kurs sotib olingan</span>
                      </div>

                      <div className="flex-1 overflow-y-auto">
                        <p className="text-gray-700 mb-4">
                          {truncateDescription2(value?.about)}
                        </p>
                        <p className="text-blue-600 font-bold text-lg">
                          {value?.price} so'm
                        </p>
                      </div>
                      <Button
                        type="primary"
                        block
                        className="mt-auto"
                        onClick={() => {
                          localStorage.setItem("locate", value?.id);
                          navigate("/frontned/");
                        }}
                      >
                        Boshlash
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-[30px] w-full">
              <Empty
                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                imageStyle={{ height: 120 }}
              />
              <span className="text-lg text-center">
                Sizda hozircha sotib olingan kurslar mavjud emas
              </span>
              <Button type="primary" size="large" onClick={() => navigate("/kurslar")}>
                Kurslarni ko'rish
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MeningKurslarim;