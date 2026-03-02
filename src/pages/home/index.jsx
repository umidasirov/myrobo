import React, { useEffect } from "react";
import axios from "axios"; // ❗ axios import qilindi
import SwiperComponent from "../../components/swipper";
import SertificateComponents from "../../components/sertificate";
import KirishComponents from "../../components/kirish";
import KursToifalariComponents from "../../components/kurs-toifalar";
import PremiumEducation from "../../components/premium";
import AnimatedStats from "../../components/animated";
import TeamComponents from "../../components/team";
import IshtirockComponents from "../../components/ishtirok-etish";
import { useData } from "../../datacontect";

function Home() {
  const token = localStorage.getItem("token");;


  return (
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
  );
}

export default Home;