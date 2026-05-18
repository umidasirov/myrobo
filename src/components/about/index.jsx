import React from "react";
import { GraduationCap, Laptop, Users, ShieldCheck } from "lucide-react";
import { color } from "framer-motion";

// Har bir feature uchun individual rang va chiziq stili qo'shildi
const features = [
  {
    id: 1,
    icon: <GraduationCap className="w-5 h-5 text-blue-600" />,
    title: "Sifatli IT ta'lim",
    text: "Dasturlash va robototexnikani amaliy o‘rganish imkoniyati.",
    underline: "border-b-4 border-blue-500", 
  },
  {
    id: 2,
    icon: <Laptop className="w-5 h-5 text-green-600" />,
    title: "Online format",
    text: "Istalgan vaqtda va istalgan joyda bilim olish tizimi.",
    underline: "border-b-4 border-green-500", 
  },
  {
    id: 3,
    icon: <Users className="w-5 h-5 text-purple-600" />,
    title: "Tajribali ustozlar",
    text: "Sohada real tajribaga ega bo'lgan mutaxassislar darslari.",
    underline: "border-b-4 border-purple-500",
  },
  {
    id: 4,
    icon: <ShieldCheck className="w-5 h-5 text-orange-600" />,
    title: "Ishonchli tizim",
    text: "O'quvchi rivojlanishini kuzatib boruvchi qulay platforma.",
    underline: "border-b-4 border-orange-500",
  },
];

const stats = [
  { value: "100+", label: "Ekspert materiallar",color:'text-blue-600' },
  { value: "10+", label: "Top yo'nalishlar",color:'text-green-600' },
  { value: "1000+", label: "Faol o'quvchilar",color:'text-purple-600' },
  { value: "95%", label: "Muvaffaqiyat (Natija)",color:'text-orange-600' },
];

const AboutMyRobo = () => {
  return (
    <section className="w-full md:w-[90%] mx-auto mt-20 mb-20 px-4 md:px-0">
      
      <div className="text-center mb-16" id="about">
        <p className="text-lg text-gray-600 dark:text-gray-400 uppercase font-medium text-center">
          Biz haqimizda
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight">
          Nega o'quvchilar <span className="text-blue-600">bizni tanlashadi</span>?
        </h2>
        <p className="mt-5 text-gray-600 dark:text-gray-400 text-base text-start shadow-lg shadow-blue-200 dark:shadow-blue-900/20 md:text-lg p-6 mx-auto leading-relaxed bg-white dark:bg-gray-800 rounded-lg ">
          Myrobo — zamonaviy IT va robototexnika ta’lim platformasi. Biz murakkab mavzularni sodda, tushunarli va amaliy usulda o‘rgatamiz. O‘quvchilar nazariya bilan cheklanib qolmay, real loyihalar, amaliy mashg‘ulotlar va tajribali ustozlar yordamida o‘z ko‘nikmalarini mustahkamlaydi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center border border-gray-100 dark:border-gray-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/20"
              >
                <p className={`text-3xl sm:text-4xl font-black ${s.color} tracking-tight`}>{s.value}</p>
                <p className="text-[11px] sm:text-xs text-gray-400 mt-2 uppercase font-bold tracking-wider leading-tight">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-100 dark:border-gray-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
             <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
               <span className="text-blue-500 font-semibold italic text-base">Myrobo</span> — zamonaviy IT va muhandislik 
               bilimlarini hamyonbop va tushunarli tarzda taqdim etuvchi 
               innovatsion markazdir.
             </p>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-5">
          {features.map((f) => (
            <div
              key={f.id}
              className={`flex items-start gap-5 bg-white dark:bg-gray-800 rounded-lg p-6 border-gray-100 shadow-lg shadow-blue-200 dark:shadow-blue-900/20 hover:shadow-[0_15px_50px_rgb(59,130,246,0.1)] transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                {f.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-950 dark:text-white text-base sm:text-lg mb-1 tracking-tight">
                  {f.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-xl">
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};

export default AboutMyRobo;