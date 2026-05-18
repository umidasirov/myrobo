import { useEffect } from "react";
import { useAxios } from "../../hooks";
import { Helmet } from 'react-helmet-async';

function Check() {
  const axios = useAxios();

  useEffect(() => {
    axios({
      url: "/api/purchased-courses/",
      method: "GET",
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>Tekshirish - MyRobo</title>
        <meta name="description" content="MyRobo platformasida sotib olingan kurslarni tekshiring." />
        <meta name="keywords" content="tekshirish, kurslar, sotib olingan, MyRobo" />
        <meta property="og:title" content="Tekshirish - MyRobo" />
        <meta property="og:description" content="MyRobo platformasida sotib olingan kurslarni tekshiring." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className=" shadow-2xl shadow-yellow-400">Check</div>
    </>
  );
}

export default Check;
