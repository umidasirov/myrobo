import React from "react";
import youtube from "../../assets/youtube.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import telegram from "../../assets/telegram.png";
import img from "../../assets/logo3.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-900 px-4 py-10 transition-colors duration-300">

      <div className="mx-auto w-[92%] max-w-7xl">

        {/* ================= MOBILE (sm gacha) ================= */}
        <div className="block sm:hidden space-y-6">

          {/* Logo */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 p-5 shadow-sm backdrop-blur-sm text-center">
            <img
              src={img}
              alt="Logo"
              className="w-20 h-20 mx-auto rounded-full bg-white p-2 shadow"
            />
            <p className="mt-3 text-sm text-gray-600">
              MyRobo — zamonaviy kasblarni o‘rganish platformasi
            </p>
          </div>

          {/* Platforma */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 p-5 shadow-sm backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900 dark:text-white">
              Platforma
            </h3>

            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link
                  to="/"
                  className="flex justify-between items-center p-3 rounded-xl border dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition dark:text-gray-300"
                >
                  Bosh sahifa <span>→</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/kurslar"
                  className="flex justify-between items-center p-3 rounded-xl border dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition dark:text-gray-300"
                >
                  Kurslar <span>→</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="flex justify-between items-center p-3 rounded-xl border dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 transition dark:text-gray-300"
                >
                  Maqolalar <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Qo‘shimcha */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 p-5 shadow-sm backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900 dark:text-white">
              Qo‘shimcha
            </h3>

            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link to="/about" className="hover:text-blue-600 transition">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition">
                  Bog‘lanish
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="hover:text-blue-600 transition">
                  Foydalanish shartlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="rounded-2xl bg-white/80 dark:bg-gray-800/80 p-5 shadow-sm backdrop-blur-sm text-center">
            <h3 className="mb-4 text-sm font-semibold uppercase text-gray-900 dark:text-white">
              Bizni kuzating
            </h3>

            <div className="flex justify-center gap-3">
              <a href="https://instagram.com">
                <img src={instagram} className="w-6 h-6" />
              </a>
              <a href="https://facebook.com">
                <img src={facebook} className="w-6 h-6" />
              </a>
              <a href="https://youtube.com">
                <img src={youtube} className="w-6 h-6" />
              </a>
              <a href="https://t.me">
                <img src={telegram} className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* ================= DESKTOP (sm dan katta) ================= */}
        <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {/* Logo */}
          <div className="">
            <img
              src={img}
              alt="Logo"
              className="w-24 h-24 bg-white dark:bg-gray-800/80  p-2 rounded-full shadow-[0_-4px_12px_rgba(128,128,128,0.3)]"
            />
            <p className="text-gray-600  dark:text-gray-400 text-sm mt-3">
              MyRobo — zamonaviy kasblarni o‘rganish platformasi.
            </p>
          </div>

          {/* Platforma */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Platforma</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600">
                  Bosh sahifa
                </Link>
              </li>
              <li>
                <Link to="/kurslar" className="hover:text-blue-600">
                  Kurslar
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-blue-600">
                  Maqolalar
                </Link>
              </li>
            </ul>
          </div>

          {/* Qo‘shimcha */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-medium mb-4">Qo‘shimcha</h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                <Link to="/about" className="hover:text-blue-600">
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600">
                  Bog‘lanish
                </Link>
              </li>
              <li>
                <Link to="/subscription" className="hover:text-blue-600">
                  Foydalanish shartlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
           <div>
            <h3 className="text-gray-900 font-medium mb-4 uppercase text-xs tracking-wider">Bizni kuzating</h3>
            <div className="flex md:justify-start gap-4 justify-center">
              <a href="https://www.instagram.com/myrobouz/" className="p-2 bg-white dark:bg-gray-700 rounded-full hover:shadow-md transition-shadow">
                <img src={instagram} alt="Instagram" className="w-5 h-5" />
              </a>
              <a href="https://facebook.com/myrobouz" className="p-2 bg-white dark:bg-gray-700 rounded-full hover:shadow-md transition-shadow">
                <img src={facebook} alt="Facebook" className="w-5 h-5" />
              </a>
              <a href="https://youtube.com/myrobouz" className="p-2 bg-white dark:bg-gray-700 rounded-full hover:shadow-md transition-shadow">
                <img src={youtube} alt="YouTube" className="w-5 h-5" />
              </a>
              <a href="https://t.me/myrobouz" className="p-2 bg-white dark:bg-gray-700 rounded-full hover:shadow-md transition-shadow">
                <img src={telegram} alt="Telegram" className="w-5 h-5" />
              </a>
            </div>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-xs italic">
              Yangiliklardan xabardor bo'lish uchun obuna bo'ling.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-gray-200 dark:border-gray-700 pt-5 text-center text-xs text-gray-500 dark:text-gray-400 flex flex-col gap-2 sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} MyRobo. Barcha huquqlar himoyalangan.</p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-5 items-center">
            <span>O‘zbekiston, Toshkent</span>
            <a href="tel:+998999035333" className="text-gray-700 dark:text-gray-300 font-medium">
              +998 99 903 53 33
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
         