import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import { Helmet } from "react-helmet-async";
import notificationApi from "../../generic/notificition";

function SubscriptionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const notify = notificationApi();
  const token = localStorage.getItem("token");

  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [showPlan, setShowPlan] = useState(false);

  const courseData = location.state?.courseData || null;

  const subscriptionPlans = [
    {
      id: "monthly",
      name: "Oylik obuna",
      price: 49000,
      duration: "30 kun",
      description: "Barcha dasturlash kurslariga cheksiz kirish 30 kun davomida",
    },
    {
      id: "yearly",
      name: "Yillik obuna",
      price: 490000,
      duration: "365 kun",
      description: "Butun yil davomida barcha dasturlash va dizayn kurslarini o'rganing",
      popular: true,
    },
    {
      id: "lifetime",
      name: "Lifetime obuna",
      price: 990000,
      duration: "Umrbod",
      description: "Umrbod barcha kurslarni va yangi materiallarni cheksiz o'z vaqtingizda o'rganing",
    },
  ];

  const handleContinue = () => {
    if (!agreeToTerms) {
      notify({
        type: "error",
        message: "Iltimos, shartlarga rozil bo'ling",
      });
      return;
    }
    setShowPlan(true);
  };

  const handleSubscribe = async () => {
    if (!token) {
      notify({ type: "token" });
      navigate("/login/");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://myrobo.uz/api/subscription/subscribe/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_type: selectedPlan,
          course_id: courseData?.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        notify({
          type: "success",
          message: "Obuna muvaffaqiyatli aktivlashtirildi!",
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        notify({
          type: "error",
          message: result?.detail || "Xatolik yuz berdi",
        });
      }
    } catch (err) {
      notify({
        type: "error",
        message: "Serverga bog'lanishda xatolik",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const strong =() =>{
    return<div className="text-gray-100">{chilren}</div>
  }
  return (
    <>
      <Helmet>
        <title>Obuna - MyRobo</title>
        <meta name="description" content="MyRobo.uz dasturlash va IT kurslariga obuna bo'ling. INFINITE CO MCHJ tomonidan taqdim etilgan" />
      </Helmet>

      <div className="bg-gray-100 min-h-screen font-sans py-8 w-full md:py-12">
        <div className="w-full">
            <div className="w-full m-auto p-0 md:p-10">
              <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
                <div className="mb-10 text-center border-b-2 border-gray-200 pb-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-blue-500 mb-4 uppercase tracking-wider">
                    OMMAVIY OFERTA SHARTNOMASI
                  </h1>
                  <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                    INFINITE CO MCHJ tomonidan MyRobo.uz platformasi orqali dasturlash va IT ta'lim xizmatlarini ko'rsatish to'g'risida
                  </p>
                </div>

                {/* Tanishtirish */}
                <div className="mb-8 text-gray-800 text-sm md:text-base leading-relaxed">
                  <p className="mb-6">
                    Mas'uliyati cheklangan jamiyat "<strong>INFINITE CO</strong>" (bundan buyon — Kompaniya) Direktor tomonidan, Ustav asosida ish yuritib, ushbu hujjat orqali dasturlash, veb-dizayn, mobil ilova ishlab chiqish va boshqa IT ta'lim xizmatlarini ko'rsatish yuzasidan Ommaviy oferta shartnomasiga (bundan buyon — Oferta, shuningdek Bitim yoki Shartnoma deb ham yuritiladi) quyida bayon etilgan shartlar asosida qo'shilish taklifini bildiradi.
                  </p>
                </div>

                {/* Shartlar kontenti */}
                <div className="space-y-6 text-gray-700 text-sm md:text-base mb-8 bg-gray-50 p-8 rounded-lg border border-gray-200">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">1. ATAMALAR VA TA'RIFLAR</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        <strong>«Onlayn platforma»</strong> – INFINITE CO MCHJ tomonidan dasturlash va IT ta'lim xizmatlarni amalga oshiriladigan https://myrobo.uz sayti va mobil ilovasi.
                      </p>
                      <p>
                        <strong>«O'quvchi/Foydalanuvchi/Mijoz»</strong> – ushbu ommaviy oferta shartlarini qabul qilgan va MyRobo onlayn platformadagi tarif rejasini xarid qilgan va onlayn platforma bilan shartnoma tuzgan, dasturlash va IT darslarni o'quyotgan shaxs.
                      </p>
                      <p>
                        <strong>«Kurs»</strong> – dasturlash, veb-dizayn, mobil ilova buni, bulutli texnologiyalar va boshqa IT fanlarni o'rganish bo'yicha taqdim etilgan tariflardan birini o'quvchi va o'quv platformasi o'rtasidagi o'zaro kelishuv yo'li bilan tanlanadigan, ta'lim olish shartlari, muddati, summasi aniq belgilangan o'quv darslari.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">2. OMMAVIY OFERTANI AKSEPT QILISH</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        Ushbu hujjatning matni Ommaviy ofertadir. O'quvchi ushbu oferta shartlariga rozilik berganligi haqida qabul qilish (aksept) harakati bilan tasdiqlanadi.
                      </p>
                      <p>
                        Taklif shartlariga rozilik uning shartlari va mobil ilovada Foydalanuvchining to'lov amalga oshirishi yoki "Rozilik beraman" tugmasini bosilishi bilan ifodalangan kelishuvdir.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">3. TARIFLAR VA XIZMATLAR</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        <strong>Oylik obuna</strong> – 30 kun davomida platformadagi barcha dasturlash va IT kurslaridan foydalanish huquqi
                      </p>
                      <p>
                        <strong>Yillik obuna</strong> – 365 kun davomida platformadagi barcha kurslardan foydalanish huquqi
                      </p>
                      <p>
                        <strong>Lifetime obuna</strong> – umrbod barcha kurslar va yangi ma'lumotlardan foydalanish huquqi
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">4. TO'LOV SHARTLARI</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        Oylik obuna: Har oy shu sanalari avtomatik ravishda qayta unadi. O'chirishni istalsangiz, hisob sozlamalari orqali istalgan vaqtda o'chirishingiz mumkin.
                      </p>
                      <p>
                        Yillik va Lifetime obunalar: Bir marotaba to'lov. Qaytarish yo'q.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">5. QAYTARISH SIYOSATI</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        Obunadan ko'ngilingiz bo'lmasa, birinchi 7 kun ichida qaytarish arqali to'lovni qaytartishi mumkin. Qaytarish arizasi qabul qilingandan keyin 5 ish kunida pul qaytariladi.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">6. XAVFSIZLIK VA MAXFIYLIK</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        Barcha to'lovlar xavfsiz SSL shifrlashtirilgan kanal orqali o'tkaziladi. Karta ma'lumotlari hech qachon bizning serverlarimizda saqlanmaydi. Sizning shaxsiy ma'lumotlarining maxfiyligini biz chuqur muhofaza qilamiz.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">7. FOYDALANUVCHINING MAJBURIYATLARI</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        • Foydalanuvchi ishonchli va dolzarb shaxsiy ma'lumotlarni taqdim etish majburiyatini oladi
                      </p>
                      <p>
                        • Foydalanuvchi ta'lim jarayoniga vijdonan yondashishi va imtiyazli o'quv materiallarini saxlamaligi kerak
                      </p>
                      <p>
                        • Foydalanuvchi video darslarini, kodlarni va dasturlash materiallarini ruxsatsiz uchinchi shaxslarga berish majburiyatini olmaydi
                      </p>
                      <p>
                        • Foydalanuvchi o'z akkauntining maxfiyligi uchun javobgardir va parolini boshqalar bilan baham ko'rmasligi kerak
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-lg underline">8. KOMPANIYANING MAJBURIYATLARI</h3>
                    <div className="space-y-3 ml-4">
                      <p>
                        • Kompaniya xarid qilingan tarif rejasi doirasida to'liq dasturlash va IT kurs materiallarini taqdim etadi
                      </p>
                      <p>
                        • Kompaniya platformaga 24/7 uzluksiz kirish imkoniyatini va texnik qo'llab-quvvatlashni taqdim etadi
                      </p>
                      <p>
                        • Kompaniya muntazam ravishda kurslarni yangilaydi va yangi dasturlash fanlarni qo'shadi
                      </p>
                      <p>
                        • Kompaniya texnik muammolar uchun kompensatsiya va qayta kirish imkoniyatini taqdim etadi
                      </p>
                    </div>
                  </div>
                </div>

                {/* <div className="border-t border-gray-200 pt-8">
                  <label className="flex items-start gap-4 cursor-pointer group mb-8 p-4 rounded-lg hover:bg-blue-50 transition-colors border-2 border-gray-200 hover:border-blue-300">
                    <input
                      type="checkbox"
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className="w-6 h-6 mt-1 cursor-pointer accent-blue-600 flex-shrink-0"
                    />
                    <span className="text-gray-800 text-sm md:text-base group-hover:text-blue-700 transition-colors leading-relaxed">
                      Men yuqoridagi <span className="font-bold text-blue-600">ommaviy oferta shartnomasi</span> bilan tanishib chiqdim va uning barcha shartlariga rozilik beraman. Shuningdek, mening{" "}
                      <span className="font-bold text-blue-600">shaxsiy ma'lumotlarining</span> himoyalashi to'g'risidagi siyosatini va INFINITE CO MCHJ tomonidan MyRobo dasturlash kurslaridan foydalanish qoidalarini qabul qilamanman.
                    </span>
                  </label>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={handleContinue}
                      disabled={!agreeToTerms}
                      className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-200 flex items-center justify-center gap-2 text-lg ${
                        agreeToTerms
                          ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl cursor-pointer"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                    >
                      Davom etish
                    </button>

                    <button
                      onClick={() => navigate(-1)}
                      className="w-full py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      Orqaga qaytish
                    </button>
                  </div>
                </div> */}

                <div className="mt-10 pt-6 border-t border-gray-200 text-center text-xs md:text-sm text-gray-600">
                  <p>
                    Agar sizda savol bo'lsa, biz bilan bog'laning:{" "}
                    <a href="mailto:support@myrobo.uz" className="text-blue-600 hover:underline font-semibold">
                      support@myrobo.uz
                    </a>
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="max-w-5xl m-auto">
              <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Dasturlash Kurslari Obunaligini Tanlang
                </h1>
                <p className="text-gray-600 text-base md:text-lg">
                  Sizga mos obuna rejimini tanlang va dasturlashni o'rgana boshlang
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-lg p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                      selectedPlan === plan.id
                        ? "bg-blue-600 text-white shadow-xl ring-2 ring-blue-300"
                        : "bg-white text-gray-900 shadow-md hover:shadow-lg"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-1 rounded-bl-lg text-xs font-bold">
                        MASHHOR
                      </div>
                    )}

                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className={`text-sm mb-4 ${selectedPlan === plan.id ? "text-blue-100" : "text-gray-600"}`}>
                      {plan.duration}
                    </p>

                    <div className="mb-4">
                      <span className="text-3xl md:text-4xl font-bold">
                        {(plan.price / 1000).toFixed(0)}
                      </span>
                      <span className={` text-sm ${selectedPlan === plan.id ? "text-blue-100" : "text-gray-600"}`}>
                        {" "}
                        ming so'm
                      </span>
                    </div>

                    <p className={`text-sm leading-relaxed ${selectedPlan === plan.id ? "text-blue-100" : "text-gray-700"}`}>
                      {plan.description}
                    </p>

                    <div
                      className={`mt-4 h-1 rounded-full ${selectedPlan === plan.id ? "bg-white" : "bg-blue-600"}`}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-8">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">To'lov Usuli</h2>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center bg-white">
                    <img
                      src="https://api.logobank.uz/media/logos_png/Uzcard-01.png"
                      alt="Uzcard"
                      className="h-12 md:h-16 object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center bg-white">
                    <img
                      src="https://humocard.uz/upload/medialibrary/8cf/ia2yatyqt4l0p0d5523erhmx6y0fssxw/HumoPay-Final-002.png"
                      alt="Humo"
                      className="h-12 md:h-16 object-contain"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-4 border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center bg-white">
                    <img
                      src="https://pr.uz/wp-content/uploads/2024/05/photo_2024-05-14_20-27-31.jpg"
                      alt="Click"
                      className="h-12 md:h-16 object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-blue-900">💳 Xavfsiz to'lov:</span> Sizning karta
                    ma'lumotlari shifrlashtirilgan va xavfsiz serverlarda saqlanadi. INFINITE CO MCHJ tomonidan boshqariladi.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleSubscribe}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-lg py-3 md:py-4 text-base md:text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isLoading ? <LoadingOutlined /> : null}
                    {isLoading
                      ? "Yuklanmoqda..."
                      : `${selectedPlan === "monthly" ? "Oylik" : selectedPlan === "yearly" ? "Yillik" : "Lifetime"} dasturlash kurslari obunaligini faollash`}
                  </button>

                  <button
                    onClick={() => setShowPlan(false)}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg py-3 font-semibold transition-colors"
                  >
                    Orqaga qaytish
                  </button>
                </div>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Xavfsizlik yoki boshqa savol bo'lsa,{" "}
                  <a href="mailto:support@myrobo.uz" className="text-blue-600 hover:underline">
                    support@myrobo.uz
                  </a>{" "}
                  bilan bog'laning. INFINITE CO MCHJ tomonidan boshqariladi.
                </p>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

export default SubscriptionPage;
