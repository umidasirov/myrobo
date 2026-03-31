import { Helmet } from "react-helmet-async";

function SubscriptionOferta() {
  return (
    <>
      <Helmet>
        <title>Ommaviy oferta shartnomasi — MyRobo.uz</title>
        <meta
          name="description"
          content="INFINITE CO MCHJ — MyRobo.uz platformasi orqali IT ta'lim xizmatlarini ko'rsatish to'g'risidagi ommaviy oferta shartnomasi"
        />
      </Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

        .oferta-root {
          --ink: #1a1a2e;
          --ink-light: #3d3d5c;
          --ink-muted: #6b6b8d;
          --paper: #faf9f7;
          --paper-warm: #f5f3ef;
          --accent: #2563eb;
          --accent-dark: #1d4ed8;
          --border: #e2e0db;
          --border-strong: #c9c6be;
          --highlight: #fef3c7;
          --section-bg: #fdfcfa;
          font-family: 'Source Serif 4', 'Georgia', serif;
          color: var(--ink);
          background: var(--paper);
          min-height: 100vh;
          line-height: 1.8;
          -webkit-font-smoothing: antialiased;
        }

        .oferta-container {
          max-width: 820px;
          margin: 0 auto;
          padding: 3rem 2rem 4rem;
        }

        @media (max-width: 640px) {
          .oferta-container { padding: 1.5rem 1rem 3rem; }
        }

        .oferta-header {
          text-align: center;
          padding-bottom: 2.5rem;
          margin-bottom: 2.5rem;
          border-bottom: 3px double var(--border-strong);
          position: relative;
        }

        .oferta-header::after {
          content: '§';
          display: block;
          font-size: 1.5rem;
          color: var(--ink-muted);
          margin-top: 1rem;
          opacity: 0.4;
        }

        .oferta-title {
          font-family: 'Playfair Display', serif;
          font-weight: 800;
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
          margin: 0 0 1rem;
        }

        .oferta-subtitle {
          font-size: 1rem;
          color: var(--ink-light);
          max-width: 600px;
          margin: 0 auto;
          font-style: italic;
        }

        .oferta-meta {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
          font-size: 0.85rem;
          color: var(--ink-muted);
          font-family: 'JetBrains Mono', monospace;
        }

        .oferta-section {
          margin-bottom: 2.2rem;
        }

        .oferta-section-title {
          font-family: 'Playfair Display', serif;
          font-weight: 700;
          font-size: 1.2rem;
          color: var(--ink);
          margin: 0 0 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border);
          letter-spacing: 0.03em;
        }

        .oferta-section-title span.num {
          display: inline-block;
          width: 2rem;
          height: 2rem;
          line-height: 2rem;
          text-align: center;
          background: var(--ink);
          color: var(--paper);
          border-radius: 4px;
          font-size: 0.85rem;
          margin-right: 0.75rem;
          font-family: 'JetBrains Mono', monospace;
          vertical-align: middle;
          position: relative;
          top: -1px;
        }

        .oferta-p {
          margin: 0 0 0.9rem;
          font-size: 0.95rem;
          color: var(--ink-light);
          text-align: justify;
          hyphens: auto;
        }

        .oferta-p:last-child { margin-bottom: 0; }

        .oferta-term {
          font-weight: 700;
          color: var(--ink);
        }

        .oferta-list {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0;
        }

        .oferta-list li {
          position: relative;
          padding-left: 1.6rem;
          margin-bottom: 0.7rem;
          font-size: 0.95rem;
          color: var(--ink-light);
        }

        .oferta-list li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65rem;
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
        }

        .oferta-highlight-box {
          background: var(--section-bg);
          border-left: 3px solid var(--accent);
          padding: 1.2rem 1.5rem;
          margin: 1rem 0;
          border-radius: 0 6px 6px 0;
        }

        .oferta-highlight-box .price {
          font-family: 'JetBrains Mono', monospace;
          font-weight: 500;
          font-size: 1.1rem;
          color: var(--accent-dark);
        }

        .oferta-footer {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 3px double var(--border-strong);
          text-align: center;
          font-size: 0.85rem;
          color: var(--ink-muted);
        }

        .oferta-footer a {
          color: var(--accent);
          text-decoration: none;
          font-weight: 600;
        }

        .oferta-footer a:hover { text-decoration: underline; }

        .oferta-divider {
          text-align: center;
          margin: 2rem 0;
          color: var(--ink-muted);
          opacity: 0.3;
          font-size: 1.2rem;
          letter-spacing: 0.5em;
        }

        @media (max-width: 768px) {
          .oferta-section {
            margin-bottom: 1.8rem;
          }

          .oferta-section-title {
            font-size: 1.05rem;
            margin: 0 0 0.8rem;
          }

          .oferta-p {
            font-size: 0.9rem;
            margin: 0 0 0.7rem;
          }

          .oferta-term {
            display: block;
            margin-bottom: 0.2rem;
            font-size: 0.85rem;
          }

          .oferta-list li {
            font-size: 0.9rem;
            margin-bottom: 0.6rem;
            padding-left: 1.4rem;
          }
        }

        @media (max-width: 480px) {
          .oferta-container {
            padding: 1.2rem 0.8rem 2.5rem;
          }

          .oferta-title {
            font-size: clamp(1.3rem, 3vw, 1.8rem);
          }

          .oferta-p {
            font-size: 0.88rem;
            margin: 0 0 0.6rem;
            text-align: left;
            line-height: 1.7;
          }

          .oferta-term {
            display: block;
            margin-bottom: 0.15rem;
            font-size: 0.8rem;
            color: var(--accent);
          }

          .oferta-meta {
            flex-direction: column;
            gap: 0.8rem;
            font-size: 0.75rem;
          }

          .oferta-list li {
            font-size: 0.88rem;
            padding-left: 1.2rem;
            margin-bottom: 0.5rem;
          }

          .oferta-list li::before {
            width: 5px;
            height: 5px;
            top: 0.6rem;
          }
        }
      `}</style>

      <div className="oferta-root">
        <div className="oferta-container">

          {/* ===== HEADER ===== */}
          <header className="oferta-header">
            <h1 className="oferta-title">Ommaviy Oferta Shartnomasi</h1>
            <p className="oferta-subtitle">
              «INFINITE CO» mas'uliyati cheklangan jamiyati tomonidan MyRobo.uz
              platformasi orqali IT ta'lim xizmatlarini ko'rsatish to'g'risida
            </p>
            <div className="oferta-meta">
              <span>Toshkent shahri</span>
              <span>Joriy tahriri: 2025-yil</span>
            </div>
          </header>

          {/* Kirish */}
          <div className="oferta-section">
            <p className="oferta-p">
              «INFINITE CO» mas'uliyati cheklangan jamiyati (bundan buyon matnda —{" "}
              <span className="oferta-term">Kompaniya</span>), O'zbekiston Respublikasi
              qonunchiligiga muvofiq faoliyat yurituvchi yuridik shaxs sifatida, ushbu
              hujjat orqali har qanday jismoniy yoki yuridik shaxsga (bundan buyon
              matnda — <span className="oferta-term">Foydalanuvchi</span>) MyRobo.uz
              onlayn ta'lim platformasi xizmatlaridan foydalanish shartlarini belgilovchi
              ommaviy oferta taklifini ilgari suradi.
            </p>
            <p className="oferta-p">
              Ushbu shartnoma O'zbekiston Respublikasi Fuqarolik kodeksining 369–371-moddalariga
              muvofiq ommaviy oferta hisoblanadi va quyida ko'rsatilgan tartibda aksept
              qilinishi bilan Foydalanuvchi va Kompaniya o'rtasida yuridik kuchga ega
              bo'lgan shartnoma tuzilgan hisoblanadi.
            </p>
          </div>

          <div className="oferta-divider">• • •</div>

          {/* ===== 1. ATAMALAR ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">1</span>Atamalar va ta'riflar
            </h2>
            <p className="oferta-p">
              <span className="oferta-term">«Platforma»</span> — «INFINITE CO» MCHJ
              tomonidan boshqariladigan, https://myrobo.uz domen manzilida joylashgan
              veb-sayt hamda tegishli mobil ilovalar majmui bo'lib, dasturlash va
              axborot texnologiyalari sohasida onlayn ta'lim xizmatlarini taqdim etadi.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Foydalanuvchi»</span> — ushbu oferta
              shartlarini aksept qilgan va Platformada ro'yxatdan o'tgan jismoniy yoki
              yuridik shaxs.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Obuna»</span> — Foydalanuvchi tomonidan
              tanlangan tarif rejasi asosida Platformadagi ta'lim materiallariga ma'lum
              muddat yoki muddatsiz kirish huquqini beruvchi pullik xizmat.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Kurs»</span> — dasturlash, veb-dizayn,
              mobil ilova ishlab chiqish, bulutli texnologiyalar va boshqa IT fanlar
              bo'yicha Platformada joylashtirilgan video darslar, amaliy topshiriqlar
              va qo'shimcha o'quv materiallari majmui.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Aksept»</span> — Foydalanuvchining
              Platformadagi «Roziman» tugmasini bosishi yoki to'lovni amalga oshirishi
              orqali ushbu oferta shartlariga to'liq va so'zsiz rozilik bildirishi.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Shaxsiy kabinet»</span> — Foydalanuvchiga
              tegishli bo'lgan, obuna holatini boshqarish, ta'lim jarayonini kuzatish
              va sozlamalarni o'zgartirish imkonini beruvchi shaxsiy sahifa.
            </p>
          </section>

          {/* ===== 2. UMUMIY QOIDALAR ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">2</span>Umumiy qoidalar
            </h2>
            <p className="oferta-p">
              2.1. Ushbu shartnoma Foydalanuvchi aksept harakatini amalga oshirgan
              paytdan boshlab kuchga kiradi va tanlangan obuna muddati tugaguniga
              qadar yoki tomonlardan biri tomonidan bekor qilinguniga qadar amal
              qiladi.
            </p>
            <p className="oferta-p">
              2.2. Foydalanuvchi «Roziman» tugmasini bosishi yoki birinchi to'lovni
              amalga oshirishi ushbu shartnomaning barcha bandlariga to'liq va
              so'zsiz rozilik bildirish hisoblanadi.
            </p>
            <p className="oferta-p">
              2.3. Kompaniya ushbu oferta shartlarini istalgan vaqtda bir tomonlama
              o'zgartirish huquqini o'zida saqlab qoladi. O'zgartirishlar Platformada
              e'lon qilingan paytdan boshlab kuchga kiradi. Faol obunaga ega
              Foydalanuvchilar uchun o'zgartirishlar joriy obuna muddati tugaganidan
              keyin qo'llaniladi.
            </p>
            <p className="oferta-p">
              2.4. Platformadan foydalanish O'zbekiston Respublikasi amaldagi
              qonunchiligiga muvofiq tartibga solinadi.
            </p>
          </section>

          {/* ===== 3. OBUNA TURLARI ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">3</span>Obuna turlari va narxlar
            </h2>
            <p className="oferta-p">
              3.1. Platformada quyidagi obuna turlari mavjud:
            </p>
            <div className="oferta-highlight-box">
              <p className="oferta-p" style={{ marginBottom: "0.5rem" }}>
                <span className="oferta-term">Oylik obuna</span> — Platformadagi
                barcha kurslar va ta'lim materiallariga 30 (o'ttiz) kalendar kun
                davomida cheksiz kirish huquqi.
              </p>
              <p className="price">Narxi: 200 000 (ikki yuz ming) so'm / oy</p>
            </div>
            <p className="oferta-p">
              3.2. Kompaniya kelajakda qo'shimcha tarif rejalarini (yillik, lifetime
              va boshqalar) joriy etish huquqini o'zida saqlab qoladi. Yangi tarif
              rejalari Platformada alohida e'lon qilinadi.
            </p>
            <p className="oferta-p">
              3.3. Obuna faollashtirilgan paytdan boshlab Foydalanuvchi tanlangan
              tarif rejasiga mos ravishda barcha mavjud kurslar, video darslar,
              amaliy topshiriqlar va qo'shimcha materiallardan foydalanish
              imkoniyatiga ega bo'ladi.
            </p>
          </section>

          {/* ===== 4. TO'LOV ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">4</span>To'lov tartibi va avtomatik yechib olish
            </h2>
            <p className="oferta-p">
              4.1. Oylik obuna uchun to'lov Foydalanuvchining bank kartasidan har
              oyning tegishli sanasida <span className="oferta-term">avtomatik
              ravishda</span> yechib olinadi. Birinchi to'lov obuna rasmiylashtirish
              vaqtida amalga oshiriladi.
            </p>
            <p className="oferta-p">
              4.2. Foydalanuvchi obunani istalgan vaqtda Shaxsiy kabinet sozlamalari
              orqali bekor qilish huquqiga ega. Bekor qilish arizasi qabul
              qilingandan so'ng, joriy to'langan davrning oxirigacha xizmatdan
              foydalanish huquqi saqlanadi va keyingi davrda avtomatik yechib olish
              to'xtatiladi.
            </p>
            <p className="oferta-p">
              4.3. Barcha to'lovlar SSL/TLS shifrlash texnologiyasi orqali
              himoyalangan xavfsiz kanal bo'ylab amalga oshiriladi. Foydalanuvchining
              bank karta ma'lumotlari Kompaniya serverlarida saqlanmaydi —
              to'lovlar litsenziyalangan to'lov provayderlari orqali qayta ishlanadi.
            </p>
            <p className="oferta-p">
              4.4. To'lov amalga oshirilmasligi (kartada mablag' yetishmasligi,
              kartaning muddati tugashi va h.k.) oqibatida obuna avtomatik ravishda
              to'xtatiladi. Foydalanuvchi to'lov ma'lumotlarini yangilagan holda
              obunani qayta faollashtirishi mumkin.
            </p>
            <p className="oferta-p">
              4.5. To'lov O'zbekiston so'mida (UZS) amalga oshiriladi. Kompaniya
              narxlarni o'zgartirish huquqini o'zida saqlab qoladi. Narx
              o'zgarishi haqida Foydalanuvchi kamida 10 (o'n) kalendar kun oldin
              xabardor qilinadi.
            </p>
          </section>

          {/* ===== 5. QAYTARISH ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">5</span>Qaytarish siyosati
            </h2>
            <p className="oferta-p">
              5.1. Foydalanuvchi obunani birinchi marta faollashtirgan sanadan
              boshlab <span className="oferta-term">7 (yetti) kalendar kun</span>{" "}
              ichida to'lovni qaytarish bo'yicha ariza yuborish huquqiga ega.
            </p>
            <p className="oferta-p">
              5.2. Qaytarish arizasi{" "}
              <a
                href="mailto:support@myrobo.uz"
                style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
              >
                support@myrobo.uz
              </a>{" "}
              elektron pochta manziliga yoki Shaxsiy kabinet orqali yuboriladi.
            </p>
            <p className="oferta-p">
              5.3. Ariza qabul qilinganidan so'ng, to'lov summasi 5 (besh) ish
              kuni ichida Foydalanuvchining bank kartasiga qaytariladi.
            </p>
            <p className="oferta-p">
              5.4. Qaytarish faqat birinchi obuna davri uchun amal qiladi. Keyingi
              davrlar uchun yechib olingan to'lovlar qaytarilmaydi, biroq
              Foydalanuvchi istalgan vaqtda keyingi davr uchun avtomatik yechib
              olishni bekor qilishi mumkin (4.2-band).
            </p>
          </section>

          {/* ===== 6. MUALLIFLIK HUQUQI ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">6</span>Intellektual mulk va mualliflik huquqi
            </h2>
            <p className="oferta-p">
              6.1. Platformada joylashtirilgan barcha ta'lim materiallari — jumladan,
              video darslar, dasturiy kodlar, matnli qo'llanmalar, grafik
              materiallar, dizayn elementlari va boshqa kontent — Kompaniyaning
              intellektual mulki hisoblanadi va O'zbekiston Respublikasining
              «Mualliflik huquqi va turdosh huquqlar to'g'risida»gi Qonuni bilan
              himoyalangan.
            </p>
            <p className="oferta-p">
              6.2. Foydalanuvchiga Platformadagi materiallardan{" "}
              <span className="oferta-term">faqat shaxsiy ta'lim maqsadida</span>{" "}
              foydalanish huquqi beriladi. Quyidagi harakatlar qat'iyan taqiqlanadi:
            </p>
            <ul className="oferta-list">
              <li>
                Ta'lim materiallarini to'liq yoki qisman nusxalash, ko'chirish
                yoki boshqa platformalarga joylashtirish
              </li>
              <li>
                Video darslar, kodlar yoki boshqa materiallarni uchinchi shaxslarga
                tarqatish, sotish yoki ijaraga berish
              </li>
              <li>
                Platformadagi kontentni tijorat maqsadlarida ishlatish yoki qayta
                ishlash
              </li>
              <li>
                Materiallarni ekran yozuvi (screen recording) yoki boshqa texnik
                vositalar yordamida ro'yxatga olish va tarqatish
              </li>
            </ul>
            <p className="oferta-p">
              6.3. Mualliflik huquqi buzilgan taqdirda Kompaniya Foydalanuvchining
              akkauntini ogohlantirmasdan bloklash va amaldagi qonunchilikka
              muvofiq huquqiy choralar ko'rish huquqiga ega.
            </p>
          </section>

          {/* ===== 7. FOYDALANUVCHI MAJBURIYATLARI ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">7</span>Foydalanuvchining majburiyatlari
            </h2>
            <ul className="oferta-list">
              <li>
                Ro'yxatdan o'tishda to'g'ri va ishonchli shaxsiy ma'lumotlarni
                taqdim etish hamda ularni dolzarb holatda saqlash
              </li>
              <li>
                Akkaunt kirish ma'lumotlarini (login va parol) maxfiy saqlash va
                uchinchi shaxslarga bermash. Akkauntdan ruxsatsiz foydalanish
                oqibatlari uchun Foydalanuvchi to'liq javobgar
              </li>
              <li>
                Platformadagi ta'lim materiallaridan faqat shaxsiy ta'lim
                maqsadlarida foydalanish va ularni tarqatmaslik
              </li>
              <li>
                Platforma ishiga xalaqit beruvchi harakatlarni amalga oshirmaslik
                (hacking, DDoS hujumlari, botlar va h.k.)
              </li>
              <li>
                Ushbu shartnoma shartlariga va O'zbekiston Respublikasi amaldagi
                qonunchiligiga rioya qilish
              </li>
              <li>
                Obuna uchun to'lovlarni o'z vaqtida amalga oshirish
              </li>
            </ul>
          </section>

          {/* ===== 8. KOMPANIYA MAJBURIYATLARI ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">8</span>Kompaniyaning majburiyatlari
            </h2>
            <ul className="oferta-list">
              <li>
                Faol obunaga ega Foydalanuvchiga tanlangan tarif rejasi doirasida
                barcha ta'lim materiallariga to'siqsiz kirish imkoniyatini
                ta'minlash
              </li>
              <li>
                Platformaning barqaror ishlashini ta'minlash va texnik nosozliklarni
                imkon qadar qisqa muddatda bartaraf etish
              </li>
              <li>
                Ta'lim kontentini muntazam yangilash va sifatini oshirish
              </li>
              <li>
                Foydalanuvchining shaxsiy ma'lumotlarini O'zbekiston Respublikasining
                «Shaxsiy ma'lumotlar to'g'risida»gi Qonuniga muvofiq himoya qilish
              </li>
              <li>
                Foydalanuvchilarning texnik va tashkiliy murojatlariga ish
                kunlarida 24 soat ichida javob berish
              </li>
              <li>
                To'lov qayta ishlash xavfsizligini ta'minlash va karta
                ma'lumotlarini saqlamslik
              </li>
            </ul>
          </section>

          {/* ===== 9. JAVOBGARLIK ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">9</span>Javobgarlik va javobgarlikni cheklash
            </h2>
            <p className="oferta-p">
              9.1. Kompaniya Platformaga uzluksiz va xatosiz kirish imkoniyatini
              kafolatlamaydi. Texnik xizmat ko'rsatish, yangilash yoki fors-major
              holatlari sababli xizmatda vaqtinchalik uzilishlar bo'lishi mumkin.
              Rejalashtirilgan texnik ishlar haqida Foydalanuvchilar oldindan
              xabardor qilinadi.
            </p>
            <p className="oferta-p">
              9.2. Kompaniya Foydalanuvchining Platformadagi bilimlarni amalda
              qo'llashi natijasida yuzaga keladigan oqibatlar uchun javobgar
              emas.
            </p>
            <p className="oferta-p">
              9.3. Foydalanuvchi o'z akkauntida amalga oshirilgan barcha harakatlar
              uchun to'liq javobgarlikni o'z zimmasiga oladi.
            </p>
            <p className="oferta-p">
              9.4. Tomonlar o'rtasida yuzaga keladigan nizolar muzokaralar yo'li
              bilan hal etiladi. Kelishuvga erishilmagan taqdirda, nizo
              O'zbekiston Respublikasi sudlari tomonidan amaldagi qonunchilikka
              muvofiq ko'rib chiqiladi.
            </p>
            <p className="oferta-p">
              9.5. Kompaniya Foydalanuvchi tomonidan ushbu shartnoma shartlari
              buzilgan taqdirda obunani to'xtatish va akkauntni bloklash huquqiga
              ega.
            </p>
          </section>

          {/* ===== 10. YAKUNIY QOIDALAR ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">10</span>Yakuniy qoidalar
            </h2>
            <p className="oferta-p">
              10.1. Ushbu shartnoma Foydalanuvchi aksept harakatini amalga
              oshirgan paytdan boshlab kuchga kiradi.
            </p>
            <p className="oferta-p">
              10.2. Shartnomada nazarda tutilmagan masalalar O'zbekiston
              Respublikasining amaldagi qonunchiligiga muvofiq tartibga solinadi.
            </p>
            <p className="oferta-p">
              10.3. Ushbu shartnomaning alohida bandlari yaroqsiz deb topilgan
              taqdirda, qolgan bandlar o'z kuchini saqlab qoladi.
            </p>
            <p className="oferta-p">
              10.4. Kompaniya ushbu oferta matnini istalgan vaqtda yangilash
              huquqini o'zida saqlab qoladi. Yangilangan matn Platformada
              joylashtirilgan paytdan boshlab kuchga kiradi.
            </p>
          </section>

          <div className="oferta-divider">• • •</div>

          {/* ===== KOMPANIYA MA'LUMOTLARI ===== */}
          <section className="oferta-section">
            <h2 className="oferta-section-title">Kompaniya rekvizitlari</h2>
            <p className="oferta-p">
              <span className="oferta-term">To'liq nomi:</span> «INFINITE CO»
              mas'uliyati cheklangan jamiyati
            </p>
            <p className="oferta-p">
              <span className="oferta-term">Platforma:</span>{" "}
              <a
                href="https://myrobo.uz"
                style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
              >
                https://myrobo.uz
              </a>
            </p>
            <p className="oferta-p">
              <span className="oferta-term">Elektron pochta:</span>{" "}
              <a
                href="mailto:support@myrobo.uz"
                style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}
              >
                support@myrobo.uz
              </a>
            </p>
            <p className="oferta-p">
              <span className="oferta-term">Bank:</span> O'zmilliybank
            </p>
            <p className="oferta-p">
              <span className="oferta-term">MFO:</span> 00450
            </p>
            <p className="oferta-p">
              <span className="oferta-term">Hisob raqami:</span> 20208000105575324001
            </p>
          </section>

          {/* ===== FOOTER ===== */}
          <footer className="oferta-footer">
            <p style={{ marginBottom: "0.5rem" }}>
              Savollar yoki murojaatlar uchun:{" "}
              <a href="mailto:support@myrobo.uz">support@myrobo.uz</a>
            </p>
            <p style={{ opacity: 0.6, fontSize: "0.8rem" }}>
              © {new Date().getFullYear()} «INFINITE CO» MCHJ. Barcha huquqlar
              himoyalangan.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}

export default SubscriptionOferta;
