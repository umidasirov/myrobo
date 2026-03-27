import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const faqData = [
  {
    id: 1,
    question: "Kurslarni tugatgandan so'ng sertifikat beriladimi?",
    answer: "Ha, barcha kurslarimiz yakunida o'quvchining bilimini tasdiqlovchi va QR-kod orqali tekshiriladigan maxsus sertifikat taqdim etiladi.",
  },
  {
    id: 2,
    question: "Darslarni qaysi vaqtda ko'rishim mumkin?",
    answer: "Platformamiz 24/7 rejimida ishlaydi. Siz o'zingizga qulay vaqtda darslarni ko'rishingiz va topshiriqlarni bajarishingiz mumkin.",
  },
  {
    id: 3,
    question: "Kurslar uchun to'lov qanday amalga oshiriladi?",
    answer: "To'lovlarni Click, Payme tizimlari yoki bank kartalari orqali xavfsiz tarzda amalga oshirishingiz mumkin. Shuningdek, bo'lib to'lash imkoniyatlari ham mavjud.",
  },
  {
    id: 4,
    question: "O'qish davomida mentorlardan yordam olsam bo'ladimi?",
    answer: "Albatta! Har bir kursning yopiq Telegram guruhi mavjud bo'lib, u yerda mentorlar sizning savollaringizga javob berishadi va loyihalaringizni tekshirishadi.",
  }
];

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full md:w-[90%] mx-auto mt-20 mb-20 px-4 md:px-0">
      {/* Sarlavha - About bo'limi bilan bir xil */}
      <div className="text-center mb-12">
        <p className="text-lg text-gray-600 font-medium text-center uppercase">
          Savol-javoblar
        </p>
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight">
          Ko'p beriladigan <span className="text-blue-600">savollar</span>
        </h2>
        <p className="mt-4 text-gray-500 text-sm md:text-base max-w-xl mx-auto">
          O'quvchilarimizni qiziqtirgan eng asosiy savollarga shu yerda javob berganmiz.
        </p>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {faqData.map((item, index) => (
          <div
            key={item.id}
            className={`bg-white rounded-lg shadow-lg shadow-blue-200 overflow-hidden transition-all duration-300`}
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex items-center justify-between p-5 md:p-6 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex w-8 h-8 rounded-lg bg-blue-50 items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                </div>
                <span className="text-sm md:text-base font-bold text-gray-900 pr-4">
                  {item.question}
                </span>
              </div>
              <div className="flex-shrink-0">
                {activeIndex === index ? (
                  <Minus className="w-5 h-5 text-blue-600" />
                ) : (
                  <Plus className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-6 pb-6 md:px-16 text-gray-600 text-xs md:text-sm leading-relaxed border-t border-gray-50 pt-4">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Qo'shimcha yordam kerakmi? */}
      <div className="mt-12 text-center">
        <p className="text-gray-500 text-sm">
          Savolingizga javob topmadingizmi?{" "}
          <a href="https://t.me/developer_id_26" className="text-blue-600 font-bold hover:underline">
            Biz bilan bog'laning
          </a>
        </p>
      </div>
    </section>
  );
};

export default FAQ;