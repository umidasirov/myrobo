import { useEffect, useState } from "react";
import { Button, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../kirish";
import { Helmet } from 'react-helmet-async';
import { apiFetch } from "../../utils/api";

function MeningKurslarim() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ apiFetch bilan 401 avtomatik logout
    apiFetch("https://myrobo.uz/api/courses/my-courses/", {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.json();
      })
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  const truncateText = (text = "", limit = 90) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };

  const postId = ( title,id) => {
    navigate(`/kurslar/${toSlug(title)}/${id}`);
  };

  if (loading) {
    return (
      <section className="w-[90%] m-auto max-[768px]:mt-[30px]">
        <h1 className="text-center py-[40px] font-bold text-[22px] max-[768px]:py-[20px]">
          Mening kurslarim
        </h1>
        <div className="flex flex-wrap justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-[280px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="h-[180px] bg-gray-200 animate-pulse" />
              <div className="p-4 flex flex-col gap-3">
                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse mt-2" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <Helmet>
        <title>Mening Kurslarim - MyRobo</title>
        <meta name="description" content="MyRobo platformasida sotib olingan kurslaringizni ko'ring va davom ettiring." />
        <meta name="keywords" content="mening kurslarim, sotib olingan kurslar, ta'lim, MyRobo" />
        <meta property="og:title" content="Mening Kurslarim - MyRobo" />
        <meta property="og:description" content="MyRobo platformasida sotib olingan kurslaringizni ko'ring va davom ettiring." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="w-[90%] m-auto max-[768px]:mt-[30px]">
      <h1 className="text-center py-[40px] font-bold text-[22px] max-[768px]:py-[20px]">
        Mening kurslarim
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {data?.length > 0 ? (
          data.map((value) => (
            <div
              key={value?.id}
              onClick={() => postId(value?.title, value?.id)}
              className="w-[280px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer flex flex-col"
            >
              <div className="h-[180px] overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  className="w-full h-full object-cover"
                  src={value?.image}
                  alt={value?.title}
                />
              </div>

              <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex items-center gap-1 text-gray-400 text-[12px]">
                  <svg
                    className="text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="#3b82f6"
                    width="16px"
                    height="16px"
                    viewBox="0 0 256 256"
                  >
                    <path d="M227.79492,52.61621l-96-32a11.98464,11.98464,0,0,0-7.58984,0L28.44678,52.53564l-.05078.01685-.19092.06372c-.17383.05786-.34107.12793-.51074.19312-.20118.07739-.40052.15722-.5962.24487-.24487.10962-.48706.22339-.72216.34814-.11817.06275-.23181.13233-.34766.199-.199.11426-.39526.23144-.58618.3562-.10938.07153-.21655.14551-.32361.2207q-.295.20655-.575.42993c-.09009.07154-.18091.14185-.26892.21607q-.33453.282-.64575.58691c-.04444.04346-.09192.0835-.13575.12744q-.37243.375-.70947.78077c-.06335.07592-.12109.15625-.18249.23364-.15516.1958-.30579.39453-.44837.59961-.07861.11279-.15332.22778-.228.34326q-.175.271-.33483.55127c-.07264.12671-.14551.25268-.21363.38257-.10583.20166-.20251.40844-.297.61645-.05225.115-.10987.22657-.15845.34351-.12842.30835-.24243.62353-.34522.94311-.04187.13086-.07544.2649-.113.39746-.06128.21656-.1189.43384-.16822.65455-.03125.14062-.05908.28222-.08545.4248-.04345.23462-.07861.47119-.10839.71-.01526.124-.03321.24732-.04468.37256C20.02209,63.2583,20,63.627,20,64v80a12,12,0,0,0,24,0V80.64868l23.7146,7.905a67.90093,67.90093,0,0,0,18.11377,84.73047,99.97006,99.97006,0,0,0-41.64819,36.16016,12.00007,12.00007,0,0,0,20.10351,13.10937,76.02217,76.02217,0,0,1,127.43213,0,12.00007,12.00007,0,0,0,20.10352-13.10937,99.97238,99.97238,0,0,0-41.64783-36.16016A67.9008,67.9008,0,0,0,188.2854,88.55371l39.50952-13.16992a11.99952,11.99952,0,0,0,0-22.76758ZM128,44.64941,186.05273,64l-20.70739,6.90234-.03272.011L128,83.35059,90.68677,70.91309l-.02844-.00953L69.94727,64ZM172,120A44,44,0,1,1,90.93738,96.29443l33.2677,11.08936a11.99358,11.99358,0,0,0,7.58984,0l33.2677-11.08936A43.87528,43.87528,0,0,1,172,120Z"></path>
                  </svg>
                  <span>{value?.buyers_total} o'quvchi</span>
                </div>

                <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
                  {value?.title}
                </h3>

                <p className="text-[13px] text-gray-500 leading-relaxed line-clamp-3 flex-1">
                  {truncateText(value?.about)}
                </p>

                <div className="mt-2">
                  <span className="text-[14px] font-semibold text-green-500 flex items-center gap-1">
                    ✓ Sotib olingan
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-[30px] w-full">
            <Empty
              image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
              imageStyle={{ height: 120 }}
            />
            <span className="text-lg text-center">
              Sizda hozircha sotib olingan kurslar mavjud emas
            </span>
            <Button type="primary" size="large" onClick={() => navigate("/kurslar")}>
              Kurslarni ko'rish
            </Button>
          </div>
        )}
      </div>
    </section>
    </>
  );
}

export default MeningKurslarim;
