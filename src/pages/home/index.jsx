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
  const { UserData } = useData();
  const token = localStorage.getItem("token");

  const handleGetData = async () => {
    if (!token) return; // token bo'lmasa request yubormaslik

    try {
      const response = await axios.get(
        "https://api.myrobo.uz/user/auth/me/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      UserData(response.data);
      console.log("Baza:", response.data);
    } catch (error) {
      console.error(
        "Login xatolik:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

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