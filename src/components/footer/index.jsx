import React from "react";
import youtube from "../../assets/youtube.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import twitter from "../../assets/twitter.png";
import img from "../../assets/logo3.png";

const Footer = () => {
  return (
    <footer className="text-center bg-gray-100 px-4 py-12 rounded-t-[40px] md:rounded-t-[60px] mt-20 border-t border-gray-200">
      <div className="max-w-7xl mx-auto w-[90%]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <div className="space-y-4 flex flex-col md:flex-row gap-2 items-center md:items-start">
            <img src={img} alt="Eduma Logo" className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-white p-2 rounded-full shadow-sm object-contain" />
            <p className="text-gray-600 hidden md:block text-sm leading-relaxed">
              Eduma — zamonaviy kasblarni o'rganish va professional mutaxassis bo'lish uchun qulay platforma.
            </p>
              <ul className="space-y-3 md:hidden text-gray-600 font-medium">
              <li className="hover:text-blue-600 transition-colors font-medium cursor-pointer">Dasturlash</li>
              <li className="hover:text-blue-600 transition-colors font-medium cursor-pointer">Marketing</li>
              <li className="hover:text-blue-600 transition-colors font-medium cursor-pointer">Biznes boshqaruvi</li>
              <li className="hover:text-blue-600 transition-colors font-medium cursor-pointer">Grafik Dizayn</li>
            </ul>
          </div>

            <ul className="space-y-3 hidden md:block text-gray-600 text-sm">
              <h3 className="text-gray-900 font-medium mb-4 uppercase text-xs tracking-wider">Platforma</h3>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Dasturlash</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Marketing</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Biznes boshqaruvi</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Grafik Dizayn</li>
            </ul>

          <div className="hidden md:block">
            <h3 className="text-gray-900 font-medium mb-4 uppercase text-xs tracking-wider">Platforma</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Biz haqimizda</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Yordam markazi</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Foydalanish shartlari</li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">Maxfiylik siyosati</li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-medium mb-4 uppercase text-xs tracking-wider">Bizni kuzating</h3>
            <div className="flex gap-4 justify-center">
              <a href="#" className="p-2 bg-white rounded-full hover:shadow-md transition-shadow">
                <img src={instagram} alt="Instagram" className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:shadow-md transition-shadow">
                <img src={facebook} alt="Facebook" className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:shadow-md transition-shadow">
                <img src={youtube} alt="YouTube" className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full hover:shadow-md transition-shadow">
                <img src={twitter} alt="Twitter" className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 text-gray-500 text-xs italic">
              Yangiliklardan xabardor bo'lish uchun obuna bo'ling.
            </p>
          </div>

        </div>

        {/* Pastki qism: Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} MyRobo. Barcha huquqlar himoyalangan.</p>
          <div className="flex gap-6">
            <span>O'zbekiston, Toshkent</span>
            <span className="font-medium text-gray-700">+998 90 123 45 67</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;