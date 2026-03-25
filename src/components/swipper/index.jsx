import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";

const SwiperComponent = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  const navigate = useNavigate();

const slides = [
  {
    id: 1,
    title: "Robototexnika",
    mentor: "Shaxobiddin",
    image: "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?q=80&w=1200&auto=format&fit=crop",
    alt: "Robototexnika",
    rating: "4.85"
  },
  {
    id: 2,
    title: "Backend",
    mentor: "Izzatillo",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    alt: "Backend",
    rating: "4.85"
  },
  {
    id: 3,
    title: "DevOps",
    mentor: "Baxodir",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    alt: "DevOps",
    rating: "4.85"
  }
];

  useEffect(() => {
    const timer = setTimeout(() => setIsPulsing(true), 500);
    const interval = setInterval(() => {
      setIsPulsing(false);
      setTimeout(() => setIsPulsing(true), 300);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="w-[90%] mx-auto rounded-2xl overflow-hidden py-8">
      <Swiper
        spaceBetween={50}
        effect={"fade"}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        modules={[Autoplay, EffectFade]}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="flex flex-col overflow-hidden md:flex-row items-center justify-between bg-white pb-8">
              <div className="w-full md:w-1/2 p-4 md:p-6 lg:p-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
                  <span className="text-blue-600">{slide.title}</span> yonalishini
                  <br />
                  <span className="text-blue-600">{slide.mentor}</span> bilan
                  o'rganing
                </h1>
                <button onClick={()=> navigate("/kurslar")} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:py-2 sm:px-5 rounded-full transition duration-300 transform hover:scale-105 text-sm">
                  Kurs paketlarini ko'rish
                </button>
              </div>

              <div className="w-full md:w-1/2 relative h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] ">
                <img
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover rounded-2xl"
                  loading="lazy"
                />
                <div
                  className={`absolute -bottom-4 right-4 w-1/2 bg-white p-3 rounded-lg shadow-md transition-all duration-500 ${
                    isPulsing ? "scale-105" : "scale-100"
                  }`}
                >
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-blue-600">
                    {slide.rating}
                  </h1>
                  <p className="text-xs text-center mt-1">
                    IJODKORLAR UCHUN{" "}
                    <span className="text-blue-500">12 MINGDAN</span> ORTIQ
                    KURSLAR <span className="text-green-500">BEPUL</span>
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
