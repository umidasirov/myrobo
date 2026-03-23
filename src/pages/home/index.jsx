import React, { useEffect } from "react";
import axios from "axios"; 
import SwiperComponent from "../../components/swipper";
import SertificateComponents from "../../components/sertificate";
import KirishComponents from "../../components/kirish";
import KursToifalariComponents from "../../components/kurs-toifalar";
import PremiumEducation from "../../components/premium";
import AnimatedStats from "../../components/animated";
import TeamComponents from "../../components/team";
import IshtirockComponents from "../../components/ishtirok-etish";
import { useData } from "../../datacontect";
import { Helmet } from 'react-helmet-async';

function Home() {
  const token = localStorage.getItem("token");;


  return (
    <>
      <Helmet>
        <title>MyRobo - Bosh sahifa</title>
        <meta name="description" content="MyRobo platformasida kurslar, sertifikatlar va ta'lim resurslariga kirish. Dasturlash va texnologiya bo'yicha eng yaxshi kurslarni toping." />
        <meta name="keywords" content="kurslar, ta'lim, dasturlash, sertifikatlar, MyRobo" />
        <meta property="og:title" content="MyRobo - Bosh sahifa" />
        <meta property="og:description" content="MyRobo platformasida kurslar, sertifikatlar va ta'lim resurslariga kirish." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="w-full max-w-[1880px] mx-auto px-4 sm:px-6 md:px-8">
        <SwiperComponent />
        <SertificateComponents />
        <KirishComponents />
        <KursToifalariComponents />
        <PremiumEducation />
        <AnimatedStats />
        <TeamComponents />
        <IshtirockComponents />
      </div>
    </>
  );
}

export default Home;