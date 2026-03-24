import React from "react";
import { motion } from "framer-motion";

const servicesData = [
  {
    title: "IT kurslari",
    description:
      "Dasturlash va texnologiyalarni o‘rganing, kelajak kasbingizni yarating.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 28H1.33334V10.6667M30.6667 16V10.6667M30.6667 10.6667V2.66669H1.33334V10.6667M30.6667 10.6667H1.33334M5.33334 6.66669H5.46668M9.33334 6.66669H9.46668M13.3333 6.66669H13.4667M18.6667 20.9697L23.3333 22.6667L28 20.9697M18.6667 20.9697L16 20L23.3333 16L30.6667 20L28 20.9697M18.6667 20.9697V25.3334L23.3333 28L28 25.3334V20.9697"
          stroke="#098CE9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Mutaxassislik kurslari",
    description:
      "IT sohasidagi chuqur bilimlarni o‘zlashtiring va tajribangizni oshiring.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 28H1.33334V10.6667M30.6667 16V10.6667M30.6667 10.6667V2.66669H1.33334V10.6667M30.6667 10.6667H1.33334M5.33334 6.66669H5.46668M9.33334 6.66669H9.46668M13.3333 6.66669H13.4667M18.6667 20.9697L23.3333 22.6667L28 20.9697M18.6667 20.9697L16 20L23.3333 16L30.6667 20L28 20.9697M18.6667 20.9697V25.3334L23.3333 28L28 25.3334V20.9697"
          stroke="#098CE9"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Sertifikatlangan kurslar",
    description:
      "Tan olingan sertifikatlarga ega bo‘lib, IT bo‘yicha professional bo‘ling.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="33"
        height="32"
        viewBox="0 0 33 32"
        fill="none"
      >
        <g clipPath="url(#clip0_1417_2033)">
          <path
            d="M30.9999 21.6141C30.9999 21.7559 30.974 21.9005 30.9654 22.043C30.776 24.7059 30.1214 26.7076 28.933 28.3518C28.2268 29.299 27.3483 30.0318 26.246 30.5679C25.9704 30.7109 25.712 30.693 25.402 30.55C23.3695 29.5671 22.026 27.8514 21.2682 25.3136C20.9237 24.1876 20.717 22.9723 20.7342 21.5783C22.405 20.7205 24.0929 19.8448 25.7465 18.969C25.7809 18.9512 25.8154 18.9333 25.8326 18.9333C25.867 18.9333 25.8843 18.9512 25.9359 18.969L27.5034 19.7911C28.6441 20.3732 30.0871 21.0958 30.9999 21.6141Z"
            stroke="#098CE9"
            strokeWidth="2"
          />
          <path
            d="M19.2667 30.6666H1.66669V1.33331H28.0667V14.5333M7.53335 7.19998H13.4M7.53335 13.0666H22.2M7.53335 18.9333H16.3334M7.53335 24.8H16.3334"
            stroke="#098CE9"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_1417_2033">
            <rect
              width="32"
              height="32"
              fill="white"
              transform="translate(0.333374)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: "easeOut",
    },
  },
};

function SertificateComponents() {
  return (
    <motion.section
      className="mt-5 rounded-2xl bg-[#f1f2f7] py-8 sm:py-10 lg:py-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={containerVariants}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
          variants={containerVariants}
        >
          {servicesData.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="group flex items-start gap-4 rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl sm:p-5 lg:p-6"
            >
              <div className="flex h-[64px] w-[64px] shrink-0 items-center justify-center rounded-full bg-blue-50 shadow-md shadow-blue-100 transition-transform duration-300 group-hover:scale-110 sm:h-[72px] sm:w-[72px]">
                {item.icon}
              </div>

              <div className="flex-1">
                <h3 className="text-[18px] font-semibold leading-tight text-gray-900 sm:text-[20px] lg:text-[22px]">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-[15px] lg:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default SertificateComponents;