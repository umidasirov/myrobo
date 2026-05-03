import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

const SwiperComponent = () => {
  const navigate = useNavigate();

  const slides = [
    {
      id: 1,
      title: "Robototexnika & IoT",
      highlight: "Kelajak texnologiyalarini",
      mentor: "Shaxobiddin",
      description:
        "Arduino va ESP32 yordamida aqlli tizimlar yaratishni noldan o'rganing.",
      image:
        "https://images.unsplash.com/photo-1561144257-e32e8efc6c4f?q=80&w=1200",
      badge: "Eng ommabop",
    },
    {
      id: 2,
      title: "Full-stack Dasturlash",
      highlight: "Zamonaviy veb-ilovalarni",
      mentor: "Ashirboyev Umidjon",
      description:
        "React, Node.js va Tailwind CSS yordamida professional loyihalar yarating.",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200",
      badge: "Sifatli ta'lim",
    },
    {
      id: 3,
      title: "Muhandislik Matematikasi",
      highlight: "Murakkab formulalarni",
      mentor: "Ekspertlar",
      description:
        "Differensial tenglamalar va ehtimollar nazariyasini amaliy misollarda tushuning.",
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200",
      badge: "Akademik yechimlar",
    },
  ];

  const tags = [
    "Arduino",
    "React JS",
    "Node.js",
    "ESP32",
    "IoT Telemetriya",
    "Matematika",
  ];

  return (
    <section className="w-full min-h-screen px-6 py-8 md:px-16 lg:px-24 
    bg-gradient-to-br from-gray-50 via-white to-gray-100 
    dark:bg-gray-900 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">

      <Swiper
        spaceBetween={30}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        modules={[Autoplay, EffectFade, Pagination]}
        className="mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="grid min-h-[500px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
              
              {/* TEXT */}
              <div className="space-y-6">
                <span className="inline-block rounded-md px-3 py-1 text-xs font-bold uppercase
                bg-blue-100 text-blue-700 
                dark:bg-gray-800 dark:text-blue-400">
                  {slide.badge}
                </span>

                <h1 className="text-4xl md:text-6xl font-black leading-[1.1] 
                text-gray-900 dark:text-white">
                  {slide.highlight} <br />
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    {slide.title}
                  </span>
                </h1>

                <p className="max-w-md text-lg leading-relaxed 
                text-gray-600 dark:text-gray-300">
                  {slide.description}
                  <br />
                  <span className="font-semibold 
                  text-gray-800 dark:text-gray-200">
                    Mentor: {slide.mentor}
                  </span>
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => navigate("/kurslar")}
                    className="rounded-xl px-8 py-4 font-bold text-white shadow-xl transition
                    bg-blue-500 hover:bg-blue-600
                    dark:bg-blue-600 dark:hover:bg-blue-500"
                  >
                    Kursni boshlash
                  </button>

                  <button
                    onClick={() => navigate("/kurslar")}
                    className="rounded-xl px-8 py-4 font-bold transition
                    border-2 border-gray-200 text-gray-800
                    hover:border-blue-600
                    dark:border-gray-700 dark:text-gray-200"
                  >
                    Barcha kurslar
                  </button>
                </div>
              </div>

              {/* IMAGE */}
              <div className="group relative">
                <div className="relative aspect-video w-full overflow-hidden rounded-[3rem] shadow-2xl
                bg-gray-200 dark:bg-gray-800">
                  
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

                  <div className="absolute bottom-8 left-8 text-white">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500" />
                      <span className="text-sm font-medium">
                        Premium darslar
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold">MyRobuz</h3>
                  </div>
                </div>
              </div>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* TAGS */}
      <div className="mt-16 pt-8 border-t 
      border-gray-200 dark:border-gray-700">
        
        <p className="mb-6 text-center text-sm font-medium uppercase tracking-widest
        text-gray-400 dark:text-gray-500">
          Asosiy Texnologiyalar
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full px-5 py-2 text-sm font-semibold shadow-sm transition
              border border-gray-200 bg-white text-gray-700
              hover:border-blue-500 hover:text-blue-600
              dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SwiperComponent; 