import { Button } from "antd";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Sahifa topilmadi - MyRobo</title>
        <meta name="description" content="Kechirasiz, siz qidirgan sahifa MyRobo platformasida mavjud emas." />
        <meta name="keywords" content="404, sahifa topilmadi, xatolik, MyRobo" />
        <meta property="og:title" content="404 - Sahifa topilmadi - MyRobo" />
        <meta property="og:description" content="Kechirasiz, siz qidirgan sahifa MyRobo platformasida mavjud emas." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col justify-center items-center px-4 transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md border border-transparent dark:border-gray-700 text-center">
          <div className="text-6xl font-bold text-blue-600 mb-4">404</div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Sahifa topilmadi
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Kechirasiz, siz qidirgan sahifa mavjud emas yoki o'chirilgan.
          </p>
          <Link to="/">
            <Button
              type="primary"
              className="hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
            >
              Bosh sahifaga qaytish
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
