import React from "react";
import KirishComponents from "../../components/kirish";
import { Helmet } from 'react-helmet-async';

function Kurslar() {
  return (
    <>
      <Helmet>
        <title>Kurslar - MyRobo</title>
        <meta name="description" content="MyRobo platformasidagi barcha mavjud kurslarni ko'ring. Dasturlash, texnologiya va boshqa sohalardagi kurslarni toping." />
        <meta name="keywords" content="kurslar, dasturlash kurslari, ta'lim kurslari, MyRobo" />
        <meta property="og:title" content="Kurslar - MyRobo" />
        <meta property="og:description" content="MyRobo platformasidagi barcha mavjud kurslarni ko'ring." />
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
