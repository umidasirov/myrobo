import { useData } from "../../datacontect";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toSlug } from "../kirish";
import { motion } from "framer-motion";
import { Briefcase, Calendar, GraduationCap, MapPin, Users } from "lucide-react";
import { Helmet } from 'react-helmet-async';

const SkeletonProfile = () => (
  <div className="w-[90%] max-w-6xl m-auto p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl mt-[60px] animate-pulse">
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-40 h-40 rounded-full bg-gray-200 mx-auto md:mx-0" />
      <div className="flex-1 space-y-4">
        <div className="h-8 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-1/4 rounded bg-gray-200" />
        <div className="h-20 w-full rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

export default function Team2() {
  const { teacherData, fetchTeam, fetchCourse, loading, data } = useData();
  const navigate = useNavigate();
  const {slug} = useParams();
  const [ready, setReady] = useState(false);
  const profileRef = useRef(null);
  const courseTeacherRef = useRef([]);

  useEffect(() => {
    fetchTeam();
    fetchCourse();
  }, []);

  useEffect(() => {
    if (!teacherData?.length || !data?.length) return;
    const profile = teacherData.find((item) => item?.slug === slug);
    if (!profile) return;

    const result = data.filter(course => 
      profile.courses.some(pCourse => pCourse.id === course.id)
    );

    profileRef.current = profile;
    courseTeacherRef.current = result;
    setReady(true);
  }, [teacherData, data, slug]);

  const postId = (title, id) => {
    localStorage.setItem("locate", id);
    navigate(`/kurslar/${toSlug(title)}`);
  };
  const truncateText = (text = "", limit = 90) => {
    if (!text) return "";
    return text.length <= limit ? text : text.slice(0, limit).trim() + "...";
  };

  if (loading || !ready) return <SkeletonProfile />;

  const profile = profileRef.current;
  const courseTeacher = courseTeacherRef.current;

  return (
    <>
      <Helmet>
        <title>{profile?.username ? `${profile.username} - MyRobo` : 'O\'qituvchi - MyRobo'}</title>
        <meta name="description" content={profile?.about || "MyRobo o'qituvchisi haqida ma'lumot."} />
        <meta name="keywords" content={`o'qituvchi, ${profile?.username || ''}, kurslar, MyRobo`} />
        <meta property="og:title" content={profile?.username || 'O\'qituvchi - MyRobo'} />
        <meta property="og:description" content={profile?.about || "MyRobo o'qituvchisi haqida ma'lumot."} />
        <meta property="og:image" content={profile?.img} />
        <meta property="og:type" content="profile" />
      </Helmet>
      <div className="w-[90%] max-w-7xl m-auto mt-[100px] mb-20 font-sans">
      <div className="relative bg-white dark:bg-gray-800 rounded-[32px] p-8 md:p-12 shadow-2xl shadow-blue-100/50 border border-blue-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-32 -mt-32 opacity-50" />
        
        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="relative">
            <div className="w-44 h-44 rounded-2xl overflow-hidden ring-4 ring-blue-50 shadow-lg">
              <img
                src={profile.img}
                alt={profile.username}
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
              />
            </div>
          </div>

          {/* Ma'lumotlar qismi */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {profile.username}
                </h1>
                <p className="text-blue-600 font-medium text-lg mt-1">{profile.direction}</p>
              </div>
              <div className="flex gap-3 justify-center">
                 <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-100">
                   {profile.experience} yillik tajriba
                 </span>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold mb-3">Mentor haqida</h3>
              <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 leading-relaxed text-lg max-w-3xl italic">
                "{profile.about}"
              </p>
            </div>

            {/* Statistika qatori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm"><Briefcase size={20} className="text-blue-500" /></div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Ish joyi</p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">{profile.work_place}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm"><Users size={20} className="text-blue-500" /></div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">O'quvchilar</p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">{courseTeacher.reduce((a, b) => a + (b.buyers_total || 0), 0)} ta</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm"><GraduationCap size={20} className="text-blue-500" /></div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase">Kurslar soni</p>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold">{courseTeacher.length} ta</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Mentor <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 bg-clip-text text-transparent">kurslari</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 dark:text-gray-500 text-sm md:text-base">
            {profile.username} tomonidan o'zlashtirilgan professional kurslar
          </p>
          <div className="mt-4 h-1 w-32 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
        </div>

        {courseTeacher.length === 0 ? (
          <div className="py-20 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-blue-200">
            <GraduationCap size={40} className="text-blue-300 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-lg font-medium">Hozircha kurslar mavjud emas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 justify-items-center md:justify-items-start">
            {courseTeacher.map((value, index) => (
              <motion.div
                key={value?.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
                onClick={() => postId(value?.title, value?.id)}
                className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer flex flex-col group"
              >
                <div className="relative h-[180px] overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-50 to-cyan-50">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    src={value?.image}
                    alt={value?.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                <div className="p-4 flex flex-col flex-1 gap-2 bg-white dark:bg-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"></div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500 text-[12px]">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                      <svg className="text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="#3b82f6" width="14px" height="14px" viewBox="0 0 256 256">
                        <path d="M227.79492,52.61621l-96-32a11.98464,11.98464,0,0,0-7.58984,0L28.44678,52.53564l-.05078.01685-.19092.06372c-.17383.05786-.34107.12793-.51074.19312-.20118.07739-.40052.15722-.5962.24487-.24487.10962-.48706.22339-.72216.34814-.11817.06275-.23181.13233-.34766.199-.199.11426-.39526.23144-.58618.3562-.10938.07153-.21655.14551-.32361.2207q-.295.20655-.575.42993c-.09009.07154-.18091.14185-.26892.21607q-.33453.282-.64575.58691c-.04444.04346-.09192.0835-.13575.12744q-.37243.375-.70947.78077c-.06335.07592-.12109.15625-.18249.23364-.15516.1958-.30579.39453-.44837.59961-.07861.11279-.15332.22778-.228.34326q-.175.271-.33483.55127c-.07264.12671-.14551.25268-.21363.38257-.10583.20166-.20251.40844-.297.61645-.05225.115-.10987.22657-.15845.34351-.12842.30835-.24243.62353-.34522.94311-.04187.13086-.07544.2649-.113.39746-.06128.21656-.1189.43384-.16822.65455-.03125.14062-.05908.28222-.08545.4248-.04345.23462-.07861.47119-.10839.71-.01526.124-.03321.24732-.04468.37256C20.02209,63.2583,20,63.627,20,64v80a12,12,0,0,0,24,0V80.64868l23.7146,7.905a67.90093,67.90093,0,0,0,18.11377,84.73047,99.97006,99.97006,0,0,0-41.64819,36.16016,12.00007,12.00007,0,0,0,20.10351,13.10937,76.02217,76.02217,0,0,1,127.43213,0,12.00007,12.00007,0,0,0,20.10352-13.10937,99.97238,99.97238,0,0,0-41.64783-36.16016A67.9008,67.9008,0,0,0,188.2854,88.55371l39.50952-13.16992a11.99952,11.99952,0,0,0,0-22.76758ZM128,44.64941,186.05273,64l-20.70739,6.90234-.03272.011L128,83.35059,90.68677,70.91309l-.02844-.00953L69.94727,64ZM172,120A44,44,0,1,1,90.93738,96.29443l33.2677,11.08936a11.99358,11.99358,0,0,0,7.58984,0l33.2677-11.08936A43.87528,43.87528,0,0,1,172,120Z"></path>
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{value?.buyers_total}</span>
                    <span className="text-gray-400 dark:text-gray-500">o'quvchi</span>
                  </div>

                  <h3 className="text-[15px] md:text-[16px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {value?.title}
                  </h3>

                  <p className="text-[12px] md:text-[13px] text-gray-500 dark:text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-3 flex-1">
                    {truncateText(value?.about)}
                  </p>

                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        {value?.price === 0 || value?.price === "0" || !value?.price ? (
                          <span className="text-[14px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-lg">Bepul</span>
                        ) : (
                          <span className="text-[14px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                            {Number(value?.price).toLocaleString("uz-UZ")} so'm
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 font-medium">→</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
    </>
  );
}