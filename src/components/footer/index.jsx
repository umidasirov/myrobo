import React from "react";
import youtube from "../../assets/youtube.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import telegram from "../../assets/telegram.png";
import img from "../../assets/logo3.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 rounded-t-[32px] md:rounded-t-[56px] border-t border-gray-200 bg-gradient-to-b from-gray-50 to-white px-4 py-10 md:py-12">
      <div className="mx-auto w-[92%] max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          
          {/* Logo + text */}
          <div className="rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
              <img
                src={img}
                alt="MyRobo Logo"
                className="h-20 w-20 rounded-full bg-white p-2 shadow object-contain sm:h-24 sm:w-24"
              />
              <p className="text-sm leading-6 text-gray-600">
                MyRobo — zamonaviy kasblarni o‘rganish va professional
                mutaxassis bo‘lish uchun qulay platforma.
              </p>
            </div>
          </div>

          {/* Platforma */}
          <div className="rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Platforma
            </h3>

            <ul className="grid grid-cols-1 gap-3 text-sm text-gray-600 sm:grid-cols-1">
              <li>
                <Link
                  to="/"
                  className="group flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>Bosh sahifa</span>
                  <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/kurslar"
                  className="group flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>Kurslar</span>
                  <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>

              <li>
                <Link
                  to="/blog"
                  className="group flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 transition-all duration-300 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <span>Maqolalar</span>
                  <span className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Foydali sahifalar */}
          <div className="rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Qo‘shimcha
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <Link
                  to="/about/#about"
                  className="transition-colors hover:text-blue-600"
                >
                  Biz haqimizda
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="transition-colors hover:text-blue-600"
                >
                  Biz bilan bog‘lanish
                </Link>
              </li>
              <li>
                <Link
                  to="/subscription"
                  className="transition-colors hover:text-blue-600"
                >
                  Foydalanish shartlari
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
              Bizni kuzating
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://www.instagram.com/myrobouz/"
                className="rounded-full bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img src={instagram} alt="Instagram" className="h-5 w-5" />
              </a>

              <a
                href="https://facebook.com/myrobouz"
                className="rounded-full bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img src={facebook} alt="Facebook" className="h-5 w-5" />
              </a>

              <a
                href="https://youtube.com/myrobouz"
                className="rounded-full bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img src={youtube} alt="YouTube" className="h-5 w-5" />
              </a>

              <a
                href="https://t.me/myrobouz"
                className="rounded-full bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <img src={telegram} alt="Telegram" className="h-5 w-5" />
              </a>
            </div>

            <p className="mt-4 text-xs italic text-gray-500">
              Yangiliklardan xabardor bo‘lish uchun obuna bo‘ling.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-gray-200 pt-5 text-center text-xs text-gray-500 md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} MyRobo. Barcha huquqlar himoyalangan.</p>

          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
            <span>O‘zbekiston, Toshkent</span>
            <a href="tel:+998999035333" className="font-medium text-gray-700">
              +998 99 903 53 33
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;