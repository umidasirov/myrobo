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
import AboutMyRobo from "../../components/about";
import FAQ from "../../components/faq";

function Home() {
  const token = localStorage.getItem("token");;


  return (
    <>
    <Helmet>
      <title>MyRobo.uz – IT kurslar, dasturlash darslari va robototexnika platformasi</title>
      <meta
        name="description"
        content="MyRobo.uz platformasida IT kurslar, dasturlash darslari, robototexnika, Arduino, React va Python bo'yicha zamonaviy ta'lim resurslarini o'rganing."
      />
      <meta
        name="keywords"
        content="MyRobo, myrobo uz, myrobo, robo ,robouz,uzrobo, myro uz,uzro, robot, uz robot,pro kurslar,Myrobo.uz,myrobo.uz,frontend kurslari,kurslar,frontend,backend, it kurslar, dasturlash darslari, robototexnika, arduino kurs, react kurs, python kurs, uzbekcha it darslar, online ta'lim platformasi"
      />
      <meta property="og:title" content="MyRobo.uz – IT kurslar va dasturlash platformasi" />
      <meta
        property="og:description"
        content="MyRobo.uz platformasida dasturlash, robototexnika va zamonaviy IT yo'nalishlarini o'rganing."
      />
      <meta property="og:type" content="website" />
    </Helmet>
      <div className="w-full max-w-[1880px] mx-auto px-2 sm:px-6 md:px-8">
        <SwiperComponent />
        <SertificateComponents />
        <KirishComponents />
        <KursToifalariComponents />
        <PremiumEducation />
        <AnimatedStats />
        <TeamComponents />
        <AboutMyRobo/>
        <FAQ/>
        <IshtirockComponents />
      </div>
    </>
  );
}

export default Home;