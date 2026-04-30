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

        html.dark .oferta-root {
          --ink: #e5e7eb;
          --ink-light: #d1d5db;
          --ink-muted: #9ca3af;
          --paper: #111827;
          --paper-warm: #1f2937;
          --accent: #3b82f6;
          --accent-dark: #60a5fa;
          --border: #374151;
          --border-strong: #4b5563;
          --highlight: #1e3a5f;
          --section-bg: #1f2937;
          background: #111827;
          color: #e5e7eb;
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

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">1</span>Atamalar va ta'riflar
            </h2>
            <p className="oferta-p">
              <span className="oferta-term">«Platforma»</span> — «INFINITE CO» MCHJ
              tomonidan boshqariladigan, https://myrobo.uz domen manzilida joylashgan
              veb-sayt hamda tegishli mobil ilovalar majmui.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Foydalanuvchi»</span> — ushbu oferta
              shartlarini roziman va Platformada ro'yxatdan o'tgan jismoniy yoki
              yuridik shaxs.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Obuna»</span> — Foydalanuvchi tomonidan
              tanlangan tarif rejasi asosida Platformadagi ta'lim materiallariga ma'lum
              muddat yoki muddatsiz kirish huquqini beruvchi pullik xizmat.
            </p>
            <p className="oferta-p">
              <span className="oferta-term">«Kurs»</span> — dasturlash va boshqa IT fanlar
              bo'yicha Platformada joylashtirilgan video darslar va materiallar majmui.
            </p>
          </section>

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">2</span>Umumiy qoidalar
            </h2>
            <p className="oferta-p">
              2.1. Ushbu shartnoma Foydalanuvchi aksept harakatini amalga oshirgan
              paytdan boshlab kuchga kiradi.
            </p>
            <p className="oferta-p">
              2.2. Foydalanuvchi «Roziman» tugmasini bosishi yoki birinchi to'lovni
              amalga oshirishi ushbu shartnomaning barcha bandlariga to'liq rozilik bildirish hisoblanadi.
            </p>
            <p className="oferta-p">
              2.3. Kompaniya ushbu oferta shartlarini istalgan vaqtda bir tomonlama
              o'zgartirish huquqini o'zida saqlab qoladi.
            </p>
          </section>

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">3</span>Obuna turlari va narxlar
            </h2>
            <p className="oferta-p">3.1. Platformada quyidagi obuna turlari mavjud:</p>
            <div className="oferta-highlight-box">
              <p className="oferta-p" style={{ marginBottom: "0.5rem" }}>
                <span className="oferta-term">Oylik obuna</span> — Platformadagi
                barcha kurslar va ta'lim materiallariga 30 kalendar kun davomida kirish huquqi.
              </p>
              <p className="price">Narxi: 200 000 (ikki yuz ming) so'm / oy</p>
            </div>
          </section>

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">4</span>To'lov tartibi va avtomatik yechib olish
            </h2>
            <p className="oferta-p">
              4.1. Oylik obuna uchun to'lov Foydalanuvchining bank kartasidan har
              oyning tegishli sanasida <span className="oferta-term">avtomatik ravishda</span> yechib olinadi.
            </p>
            <p className="oferta-p">
              4.2. Foydalanuvchi obunani istalgan vaqtda Shaxsiy kabinet orqali bekor qilish huquqiga ega.
            </p>
            <p className="oferta-p">
              4.3. Barcha to'lovlar SSL/TLS shifrlash texnologiyasi orqali himoyalangan.
            </p>
          </section>

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
              <a href="mailto:support@myrobo.uz" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                support@myrobo.uz
              </a>{" "}
              elektron pochta manziliga yoki Shaxsiy kabinet orqali yuboriladi.
            </p>
          </section>

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">6</span>Intellektual mulk va mualliflik huquqi
            </h2>
            <p className="oferta-p">
              6.1. Platformada joylashtirilgan barcha ta'lim materiallari Kompaniyaning
              intellektual mulki hisoblanadi.
            </p>
            <ul className="oferta-list">
              <li>Ta'lim materiallarini to'liq yoki qisman nusxalash taqiqlanadi</li>
              <li>Video darslarni uchinchi shaxslarga tarqatish taqiqlanadi</li>
              <li>Platformadagi kontentni tijorat maqsadlarida ishlatish taqiqlanadi</li>
            </ul>
          </section>

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">7</span>Foydalanuvchining majburiyatlari
            </h2>
            <ul className="oferta-list">
              <li>Ro'yxatdan o'tishda to'g'ri shaxsiy ma'lumotlarni taqdim etish</li>
              <li>Akkaunt kirish ma'lumotlarini maxfiy saqlash</li>
              <li>Platformadagi ta'lim materiallaridan faqat shaxsiy maqsadda foydalanish</li>
              <li>Platforma ishiga xalaqit beruvchi harakatlarni amalga oshirmaslik</li>
              <li>Obuna uchun to'lovlarni o'z vaqtida amalga oshirish</li>
            </ul>
          </section>

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">8</span>Kompaniyaning majburiyatlari
            </h2>
            <ul className="oferta-list">
              <li>Faol obunaga ega Foydalanuvchiga barcha ta'lim materiallariga kirish imkoniyatini ta'minlash</li>
              <li>Platformaning barqaror ishlashini ta'minlash</li>
              <li>Ta'lim kontentini muntazam yangilash</li>
              <li>Foydalanuvchining shaxsiy ma'lumotlarini himoya qilish</li>
            </ul>
          </section>

          <section className="oferta-section">
            <h2 className="oferta-section-title">
              <span className="num">9</span>Javobgarlik va javobgarlikni cheklash
            </h2>
            <p className="oferta-p">
              9.1. Kompaniya Platformaga uzluksiz kirish imkoniyatini kafolatlamaydi.
            </p>
            <p className="oferta-p">
              9.2. Foydalanuvchi o'z akkauntida amalga oshirilgan barcha harakatlar
              uchun to'liq javobgarlikni o'z zimmasiga oladi.
            </p>
          </section>

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
          </section>

          <div className="oferta-divider">• • •</div>

          <section className="oferta-section">
            <h2 className="oferta-section-title">Kompaniya rekvizitlari</h2>
            <p className="oferta-p">
              <span className="oferta-term">To'liq nomi:</span> «INFINITE CO»
              mas'uliyati cheklangan jamiyati
            </p>
            <p className="oferta-p">
              <span className="oferta-term">Platforma:</span>{" "}
              <a href="https://myrobo.uz" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                https://myrobo.uz
              </a>
            </p>
            <p className="oferta-p">
              <span className="oferta-term">Elektron pochta:</span>{" "}
              <a href="mailto:support@myrobo.uz" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
                support@myrobo.uz
              </a>
            </p>
            <p className="oferta-p"><span className="oferta-term">Bank:</span> O'zmilliybank</p>
            <p className="oferta-p"><span className="oferta-term">MFO:</span> 00450</p>
            <p className="oferta-p"><span className="oferta-term">Hisob raqami:</span> 20208000105575324001</p>
          </section>

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
