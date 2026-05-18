import React from "react";
import { motion } from "framer-motion";

const servicesData = [
  {
    title: "IT kurslari",
    description: "Dasturlash va texnologiyalarni o'rganing, kelajak kasbingizni yarating",
    icon: "M16 28H1.33334V10.6667M30.6667 16V10.6667M30.6667 10.6667V2.66669H1.33334V10.6667M30.6667 10.6667H1.33334M5.33334 6.66669H5.46668M9.33334 6.66669H9.46668M13.3333 6.66669H13.4667M18.6667 20.9697L23.3333 22.6667L28 20.9697M18.6667 20.9697L16 20L23.3333 16L30.6667 20L28 20.9697M18.6667 20.9697V25.3334L23.3333 28L28 25.3334V20.9697"
  },
  {
    title: "Mutaxassislik kurslari",
    description: "IT sohasidagi chuqur bilimlarni o'zlashtiring va tajribangizni oshiring",
    icon: "M16 28H1.33334V10.6667M30.6667 16V10.6667M30.6667 10.6667V2.66669H1.33334V10.6667M30.6667 10.6667H1.33334M5.33334 6.66669H5.46668M9.33334 6.66669H9.46668M13.3333 6.66669H13.4667M18.6667 20.9697L23.3333 22.6667L28 20.9697M18.6667 20.9697L16 20L23.3333 16L30.6667 20L28 20.9697M18.6667 20.9697V25.3334L23.3333 28L28 25.3334V20.9697"
  },
  {
    title: "Sertifikatlangan kurslar",
    description: "Tan olingan sertifikatlarga ega bo'lib, IT bo'yicha professional bo'ling.",
    icon: "M30.9999 21.6141C30.9999 21.7559 30.974 21.9005 30.9654 22.043C30.776 24.7059 30.1214 26.7076 28.933 28.3518C28.2268 29.299 27.3483 30.0318 26.246 30.5679C25.9704 30.7109 25.712 30.693 25.402 30.55C23.3695 29.5671 22.026 27.8514 21.2682 25.3136C20.9237 24.1876 20.717 22.9723 20.7342 21.5783C22.405 20.7205 24.0929 19.8448 25.7465 18.969C25.7809 18.9512 25.8154 18.9333 25.8326 18.9333C25.867 18.9333 25.8843 18.9512 25.9359 18.969L27.5034 19.7911C28.6441 20.3732 30.0871 21.0958 30.9999 21.6141Z"
  }
];

function SertificateComponents() {
  const containerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.12,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: {
      scale: 1.2,
      rotate: 8,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="w-full bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 rounded-lg md:rounded-2xl py-6 sm:py-8 md:py-12 lg:py-16 mt-4 sm:mt-6 md:mt-10 mb-4 md:mb-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              className="group flex flex-col sm:flex-row items-center sm:items-start lg:flex-col lg:items-center gap-3 sm:gap-4 md:gap-5 p-4 sm:p-5 md:p-6 lg:p-7 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-md border border-white/50 hover:bg-white hover:border-blue-200 hover:shadow-lg md:hover:shadow-xl transition-all duration-300 ease-out"
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
            >
              {/* Icon Container */}
              <motion.div
                className="flex-shrink-0"
                variants={iconVariants}
                initial="initial"
                whileHover="hover"
              >
                <div className="w-14 h-14 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-md shadow-blue-200/50 group-hover:shadow-lg group-hover:shadow-blue-300/60 transition-all duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    className="sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 transition-all"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d={service.icon}
                      stroke="#098CE9"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
              </motion.div>

              {/* Text Container */}
              <div className="flex-1 text-center sm:text-left lg:text-center min-w-0">
                <h3 className="text-base sm:text-sm md:text-lg lg:text-xl font-bold text-gray-900 mb-1.5 md:mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="text-xs sm:text-[13px] md:text-sm lg:text-base text-gray-600 leading-relaxed line-clamp-3 group-hover:text-gray-700 transition-colors duration-200">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

export default SertificateComponents;
