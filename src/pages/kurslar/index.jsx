import React from "react";
import KirishComponents from "../../components/kirish";
import { Helmet } from 'react-helmet-async';

function Kurslar() {
  return (
    <>
      <Helmet>
        <title>Kurslar - Myrobo</title>
        <meta name="description" content="Myrobo platformasidagi barcha mavjud kurslarni ko'ring. Dasturlash, texnologiya va boshqa sohalardagi kurslarni toping." />
        <meta name="keywords" content="kurslar, dasturlash kurslari, ta'lim kurslari, Myrobo" />
        <meta property="og:title" content="Kurslar - Myrobo" />
        <meta property="og:description" content="Myrobo platformasidagi barcha mavjud kurslarni ko'ring." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="w-[90%] m-auto mt-[40px]">
        <div className="text-center">
          <h1 className="text-[32px] font-bold">Kurslar</h1>
        </div>
        <div>
          <KirishComponents />
        </div>
      </section>
    </>
  );
}

export default Kurslar;
