import { useData } from "../../datacontect";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toSlug } from "../kirish";

const SkeletonProfile = () => (
  <div className="w-[90%] m-auto p-6 bg-white rounded-lg shadow-md mt-[60px] shadow-blue-100 animate-pulse">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex flex-col items-center md:items-start gap-3">
        <div className="w-32 h-32 rounded-lg bg-gray-200" />
        <div className="h-5 w-32 rounded bg-gray-200" />
        <div className="h-4 w-24 rounded bg-gray-200" />
      </div>
      <div className="flex-1 flex flex-col gap-4 mt-4">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
    </div>
  </div>
);

const EmptyCourses = () => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16 text-gray-300"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
    <h3 className="text-xl font-semibold text-gray-500">
      Hozircha kurslar mavjud emas
    </h3>
    <p className="text-gray-400 max-w-sm">
      Bu ustoz hali kurs qo'shmagan. Keyinroq tekshiring.
    </p>
  </div>
);

export default function Team2() {
  const { teacherData, fetchTeam, fetchCourse, loading, data } = useData();
  const navigate = useNavigate();
  const slug = localStorage.getItem("location");
  const token = localStorage.getItem("token");

  const profileRef = useRef(null);
  const courseTeacherRef = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetchTeam();
    fetchCourse();
  }, []);

  useEffect(() => {
    if (!teacherData?.length || !data?.length) return;

    const profile = teacherData.find((item) => item?.slug === slug);
    if (!profile) return;

    const result = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < profile.courses.length; j++) {
        if (profile.courses[j].id === data[i].id) {
          result.push(data[i]);
          break;
        }
      }
    }

    profileRef.current = profile;
    courseTeacherRef.current = result;
    setReady(true);
  }, [teacherData, data]);

  const truncateText = (text = "", limit = 90) => {
    if (!text) return "";
    if (text.length <= limit) return text;
    return text.slice(0, limit).trim() + "...";
  };

  // Slug sahifasiga yuboramiz — u yerda access tekshiriladi
  const postId = (title, id) => {
    const courseSlug = toSlug(title);
    localStorage.setItem("locate", id);
    navigate(`/kirish2/${courseSlug}`);
  };

  if (loading || !ready) {
    return <SkeletonProfile />;
  }

  const profile = profileRef.current;
  const courseTeacher = courseTeacherRef.current;

  return (
    <div className="w-[90%] m-auto mt-[60px] mb-11">
      <div className="p-6 bg-white rounded-lg shadow-md shadow-blue-100">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <img
              src={profile.img}
              alt={profile.username}
              className="w-32 h-32 object-cover rounded-lg shadow-sm mb-4"
            />
            <h2 className="text-xl font-bold">{profile.username}</h2>
            <p className="text-gray-600 mt-1">{profile.direction}</p>
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium mb-2">Mentor haqida</h3>
              <p className="text-gray-600">{profile.about}</p>
            </div>

            <div className="pt-4">
              <h3 className="text-lg font-medium mb-4">Yo'nalish</h3>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 text-sm border border-gray-300 rounded-full">
                  {profile.direction}
                </span>
              </div>

              <div className="border-t border-b py-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Yillik tajribasi</span>
                  <span>{profile.experience} yil</span>
                </div>
              </div>

              <div className="border-b py-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ish joyi</span>
                  <span className="text-blue-600">{profile.work_place}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h3 className="text-2xl font-bold mb-6 text-center">
          Ustoz <span className="text-blue-600">kurslari</span>
        </h3>

        {courseTeacher.length === 0 ? (
          <EmptyCourses />
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {courseTeacher.map((value) => (
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
                    {value?.price === 0 ||
                    value?.price === "0" ||
                    !value?.price ? (
                      <span className="text-[16px] font-bold text-blue-500">
                        Bepul
                      </span>
                    ) : (
                      <span className="text-[16px] font-bold text-blue-500">
                        {Number(value?.price).toLocaleString("uz-UZ")} so'm
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
