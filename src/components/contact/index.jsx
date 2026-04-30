import React from "react";
import { MapPin, Phone, Mail, MessageCircle, Send, User, AtSign } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      id: 1,
      icon: <MapPin className="w-5 h-5 text-blue-600" />,
      title: "Manzil",
      value: "Toshkent shahar, Mirzo Ulug'bek tumani, Universitet ko'chasi, 45-uy",
      color: "border-blue-500",
    },
    {
      id: 2,
      icon: <Phone className="w-5 h-5 text-green-600" />,
      title: "Telefon raqam",
      value: "+998 95 398 81 98",
      color: "border-green-500",
    },
    {
      id: 3,
      icon: <Mail className="w-5 h-5 text-purple-600" />,
      title: "Elektron pochta",
      value: "info@myrobo.uz",
      color: "border-purple-500",
    },
    {
      id: 4,
      icon: <MessageCircle className="w-5 h-5 text-orange-600" />,
      title: "Telegram bot",
      value: "@myrobo",
      color: "border-orange-500",
    },
  ];

  return (
    <section className="w-full md:w-[90%] mx-auto mt-20 mb-20 px-4 md:px-0">
      <div className="text-center mb-16">
        <p className="text-lg text-gray-600 dark:text-gray-400 uppercase font-medium text-center">
          Biz bilan bog'lanish
        </p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-gray-950 dark:text-white tracking-tight leading-tight">
          Biz bilan <span className="text-blue-600">bog'laning</span>
        </h2>
        <p className="mt-5 text-gray-600 dark:text-gray-400 text-base text-start shadow-lg shadow-blue-200 dark:shadow-blue-900/20 bg-white dark:bg-gray-800 md:text-lg p-6 mx-auto leading-relaxed rounded-lg">
          Agar sizda biron bir savollaringiz bo'lsa yoki xizmatlarimiz haqida qo'shimcha ma'lumot olishni istasangiz, quyidagi vositalar orqali biz bilan bog'lanishingiz mumkin.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Section */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <h3 className="text-xl font-bold text-gray-950 dark:text-white mb-4">Bog'lanish</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Biz sizning savollaringizga javob berish va sizga yordam berish uchun doimo tayyorimiz. 
              Istalgan vaqt biz bilan bog'lanishingiz mumkin.
            </p>
            
            <div className="space-y-5">
              {contactInfo.map((info) => (
                <div key={info.id} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-1">
                      {info.title}
                    </p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium text-sm sm:text-base break-words">
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 md:p-8 border border-gray-100 dark:border-gray-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            <h3 className="text-2xl font-bold text-gray-950 dark:text-white mb-6">Xabar yuborish</h3>
            
            <form className="space-y-5">
              {/* Ism input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ismingiz <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ismingizni kiriting"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                    required
                  />
                </div>
              </div>

              {/* Telegram manzili input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telegram manzili
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="@username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Telefon input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefon raqam
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="+998 (__) __.__-__.__-__"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Xabar input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Xabaringiz
                </label>
                <textarea
                  rows={4}
                  placeholder="Xabaringizni shu yerga yozing"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 resize-none bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                Yuborish
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;