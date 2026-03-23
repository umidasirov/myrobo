import { Button } from "antd";
import img from "../../assets/404not_found.png";
import { useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';

function Sertificatlarim() {
  const navigate = useNavigate();
  return (
    <>
      <Helmet>
        <title>Sertifikatlarim - MyRobo</title>
        <meta name="description" content="MyRobo platformasida olingan sertifikatlaringizni ko'ring." />
        <meta name="keywords" content="sertifikatlar, yutuqlar, kurslar, MyRobo" />
        <meta property="og:title" content="Sertifikatlarim - MyRobo" />
        <meta property="og:description" content="MyRobo platformasida olingan sertifikatlaringizni ko'ring." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section>
      <div className="w-[90%] m-auto">
        <div className="flex items-center justify-center h-[79vh] flex-col ">
          <img className="w-[30%] max-[768px]:w-[50%]" src={img} alt="" />
          <div className="flex items-center justify-center flex-col gap-[20px]">
            <h1 className="font-bold text-[24px] ">
              Sertificatingiz mavjud emas !
            </h1>
            <p className="text-[17px] text-center">
              Bu yer hozircha bo‘sh – Ammo tez orada sizning yutuqlaringiz bilan
              to‘ladi! 🏆
            </p>
            <Button onClick={() => navigate("/")} type="primary">
              Bosh sahifa
            </Button>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}

export default Sertificatlarim;
