import { useState, useEffect, useCallback, useRef } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────
const API = "https://myrobo.adxamov.uz/api";
const TOKEN_KEY = "token";
const PAGE_SIZE = 12;

// ─── API Helpers ─────────────────────────────────────────────────────────────
function getToken() { return localStorage.getItem(TOKEN_KEY) || ""; }

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
  return res;
}

async function apiJson(path, options = {}) {
  const res = await apiFetch(path, options);
  if (!res.ok) {
    const err = new Error(`${res.status}`);
    err.status = res.status;
    try { err.body = await res.json(); } catch {}
    throw err;
  }
  return res.json();
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("uz-UZ", { year: "numeric", month: "short", day: "numeric" });
}
function num(n) { return (n ?? 0).toLocaleString(); }
function initials(name) { return (name || "?").split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2); }

// ─── Theme ───────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(() => {
    const s = localStorage.getItem("mr-theme");
    return s ? s === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => { localStorage.setItem("mr-theme", dark ? "dark" : "light"); }, [dark]);
  return [dark, () => setDark(d => !d)];
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function useToast() {
  const [toasts, set] = useState([]);
  const toast = useCallback((msg, type = "success") => {
    const id = Date.now() + Math.random();
    set(t => [...t, { id, msg, type }]);
    setTimeout(() => set(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return [toasts, toast];
}

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  blue: "#2563eb",
  blueLight: "#eff6ff",
  blueDark: "#1e2a42",
  green: "#16a34a",
  greenLight: "#f0fdf4",
  greenDark: "#1a2e1a",
  amber: "#d97706",
  amberLight: "#fffbeb",
  amberDark: "#2a2010",
  red: "#dc2626",
  redLight: "#fef2f2",
  redDark: "#2a1010",
  purple: "#7c3aed",
  purpleLight: "#f5f3ff",
  purpleDark: "#1e1a2e",
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const BADGE = {
  blue:   { bg: "#dbeafe", text: "#1d4ed8", darkBg: "#1e2a42", darkText: "#60a5fa" },
  green:  { bg: "#dcfce7", text: "#15803d", darkBg: "#1a2e1a", darkText: "#4ade80" },
  amber:  { bg: "#fef3c7", text: "#b45309", darkBg: "#2a2010", darkText: "#fbbf24" },
  red:    { bg: "#fee2e2", text: "#b91c1c", darkBg: "#2a1010", darkText: "#f87171" },
  purple: { bg: "#ede9fe", text: "#6d28d9", darkBg: "#1e1a2e", darkText: "#a78bfa" },
  gray:   { bg: "#f1f5f9", text: "#475569", darkBg: "#1e2a3a", darkText: "#94a3b8" },
};

function Badge({ label, color = "blue", dark }) {
  const c = BADGE[color] || BADGE.gray;
  return (
    <span style={{
      display: "inline-block", padding: "2px 9px", borderRadius: 6,
      background: dark ? c.darkBg : c.bg,
      color: dark ? c.darkText : c.text,
      fontSize: 11, fontWeight: 600, letterSpacing: 0.2,
    }}>{label}</span>
  );
}

// ─── Theme-aware vars ─────────────────────────────────────────────────────────
function tv(dark) {
  return {
    bg: dark ? "#0f1623" : "#f8fafc",
    surface: dark ? "#141824" : "#ffffff",
    surface2: dark ? "#1a2035" : "#f8fafc",
    border: dark ? "#1e2a3a" : "#e8edf5",
    border2: dark ? "#2d3650" : "#d1d9e6",
    text: dark ? "#e2e8f0" : "#0f172a",
    muted: dark ? "#64748b" : "#64748b",
    faint: dark ? "#1e2a3a" : "#f1f5f9",
  };
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function Ico({ name, size = 16, color = "currentColor" }) {
  const paths = {
    grid:     "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
    blog:     "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    tag:      "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
    chat:     "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
    users:    "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    book:     "M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    eye:      "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
    trash:    "M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6",
    edit:     "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    plus:     "M12 5v14M5 12h14",
    search:   "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
    refresh:  "M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
    sun:      "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 100-10 5 5 0 000 10z",
    moon:     "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
    logout:   "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
    external: "M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3",
    chart:    "M18 20V10M12 20V4M6 20v-6",
    play:     "M5 3l14 9-14 9V3z",
    code:     "M16 18l6-6-6-6M8 6l-6 6 6 6",
    check:    "M20 6L9 17l-5-5",
    x:        "M18 6L6 18M6 6l12 12",
    coin:     "M12 2a10 10 0 100 20A10 10 0 0012 2zM12 6v6l4 2",
    star:     "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    teacher:  "M12 14l9-5-9-5-9 5 9 5zM12 14l6.16-3.42a12.08 12.08 0 01.34 2.76A12 12 0 0112 18a12 12 0 01-6.5-1.66 12.08 12.08 0 01.34-2.76L12 14zM12 14V21",
    bell:     "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
    lock:     "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM17 11V7a5 5 0 00-10 0v4",
    user:     "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
    phone:    "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.8 19.79 19.79 0 01.22 2.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.09a16 16 0 006 6l.61-.61a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
    telegram: "M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z",
    ban:      "M12 22a10 10 0 100-20 10 10 0 000 20zM4.93 4.93l14.14 14.14",
    key:      "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
    save:     "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name] || paths.grid} />
    </svg>
  );
}

// ─── Reusable components ──────────────────────────────────────────────────────

function Card({ children, dark, style = {} }) {
  const t = tv(dark);
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`,
      borderRadius: 14, overflow: "hidden", ...style
    }}>{children}</div>
  );
}

function CardHead({ children, dark }) {
  const t = tv(dark);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "13px 18px", borderBottom: `1px solid ${t.border}`,
    }}>{children}</div>
  );
}

function CardTitle({ children, dark }) {
  const t = tv(dark);
  return <span style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{children}</span>;
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled, dark, icon }) {
  const t = tv(dark);
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    borderRadius: 9, cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: 600, fontFamily: "inherit", transition: "opacity 0.15s",
    opacity: disabled ? 0.5 : 1, border: "none",
  };
  const sizes = {
    sm: { padding: "5px 12px", fontSize: 12 },
    md: { padding: "7px 16px", fontSize: 13 },
    lg: { padding: "9px 20px", fontSize: 14 },
  };
  const variants = {
    primary: { background: C.blue, color: "#fff" },
    danger: { background: C.red, color: "#fff" },
    success: { background: C.green, color: "#fff" },
    ghost: { background: "transparent", color: t.muted, border: `1px solid ${t.border2}` },
    outline: { background: dark ? "#1e2a42" : C.blueLight, color: C.blue, border: `1px solid ${dark ? "#2d4080" : "#bfdbfe"}` },
  };
  return (
    <button onClick={onClick} disabled={disabled} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {icon && <Ico name={icon} size={13} />}
      {children}
    </button>
  );
}

function Input({ value, onChange, placeholder, dark, type = "text", style = {} }) {
  const t = tv(dark);
  return (
    <input
      type={type} value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        padding: "8px 12px", borderRadius: 9,
        border: `1px solid ${t.border2}`,
        background: t.surface2, color: t.text,
        fontSize: 13, outline: "none", fontFamily: "inherit",
        width: "100%", ...style,
      }}
    />
  );
}

function Search({ value, onChange, dark, placeholder = "Qidirish..." }) {
  const t = tv(dark);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "6px 12px", borderRadius: 9,
      border: `1px solid ${t.border2}`, background: t.surface2,
    }}>
      <Ico name="search" size={13} color={t.muted} />
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, color: t.text, width: 160, fontFamily: "inherit" }}
      />
    </div>
  );
}

function Select({ value, onChange, children, dark }) {
  const t = tv(dark);
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      padding: "6px 10px", borderRadius: 9,
      border: `1px solid ${t.border2}`,
      background: t.surface2, color: t.text,
      fontSize: 13, cursor: "pointer", fontFamily: "inherit",
    }}>{children}</select>
  );
}

function IconBtn({ name, onClick, dark, title, danger }) {
  const t = tv(dark);
  return (
    <button onClick={onClick} title={title} style={{
      width: 30, height: 30, borderRadius: 8,
      border: `1px solid ${t.border2}`, background: "transparent",
      cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
      color: danger ? C.red : t.muted,
    }}>
      <Ico name={name} size={13} />
    </button>
  );
}

function Table({ cols, rows, dark, loading, empty = "Ma'lumot topilmadi" }) {
  const t = tv(dark);
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {cols.map(c => (
              <th key={c.key} style={{
                padding: "9px 14px", textAlign: "left",
                fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em",
                color: t.muted, background: t.surface2, borderBottom: `1px solid ${t.border}`,
                width: c.width,
              }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={cols.length} style={{ padding: 40, textAlign: "center", color: t.muted, fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</span> Yuklanmoqda...
              </div>
            </td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding: 40, textAlign: "center", color: t.muted, fontSize: 13 }}>{empty}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={row.id || row.slug || i} style={{ borderBottom: `1px solid ${t.border}` }}>
              {cols.map(c => (
                <td key={c.key} style={{ padding: "11px 14px", fontSize: 13, color: t.text }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Pagination({ page, total, pageSize, onChange, dark }) {
  const pages = Math.ceil(total / pageSize);
  if (pages <= 1) return null;
  const t = tv(dark);
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 18px", borderTop: `1px solid ${t.border}`,
    }}>
      <span style={{ fontSize: 12, color: t.muted }}>
        {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} / {total}
      </span>
      <div style={{ display: "flex", gap: 4 }}>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onChange(p)} style={{
            width: 28, height: 28, borderRadius: 7,
            border: `1px solid ${p === page ? C.blue : t.border2}`,
            background: p === page ? C.blue : "transparent",
            color: p === page ? "#fff" : t.muted,
            cursor: "pointer", fontSize: 12, fontWeight: p === page ? 600 : 400,
          }}>{p}</button>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, accent, dark }) {
  const t = tv(dark);
  const accents = {
    blue: { bg: dark ? C.blueDark : C.blueLight, ico: C.blue },
    green: { bg: dark ? C.greenDark : C.greenLight, ico: C.green },
    amber: { bg: dark ? C.amberDark : C.amberLight, ico: C.amber },
    purple: { bg: dark ? C.purpleDark : C.purpleLight, ico: C.purple },
    red: { bg: dark ? C.redDark : C.redLight, ico: C.red },
  };
  const ac = accents[accent] || accents.blue;
  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14,
      padding: "16px 18px",
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: ac.bg,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12,
      }}>
        <Ico name={icon} size={17} color={ac.ico} />
      </div>
      <div style={{ fontSize: 11, color: t.muted, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: t.text, letterSpacing: -0.5 }}>{value ?? "—"}</div>
    </div>
  );
}

function Modal({ open, onClose, title, children, dark }) {
  if (!open) return null;
  const t = tv(dark);
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9000,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 14, padding: "24px 28px", width: 420, maxWidth: "90vw",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: t.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: t.muted }}>
            <Ico name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ open, onConfirm, onCancel, title, desc, dark }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} dark={dark}>
      <p style={{ fontSize: 13, color: tv(dark).muted, marginBottom: 20, lineHeight: 1.6 }}>{desc}</p>
      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <Btn variant="ghost" dark={dark} onClick={onCancel}>Bekor</Btn>
        <Btn variant="danger" dark={dark} onClick={onConfirm}>O'chirish</Btn>
      </div>
    </Modal>
  );
}

function ToastList({ toasts, dark }) {
  const t = tv(dark);
  return (
    <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map(toast => {
        const colors = {
          success: { dot: C.green, border: dark ? "#1a3320" : "#bbf7d0" },
          error: { dot: C.red, border: dark ? "#331a1a" : "#fecaca" },
          info: { dot: C.blue, border: dark ? "#1a2233" : "#bfdbfe" },
        };
        const cc = colors[toast.type] || colors.info;
        return (
          <div key={toast.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px", borderRadius: 10,
            background: t.surface, border: `1px solid ${cc.border}`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
            fontSize: 13, color: t.text, minWidth: 240,
            animation: "fadeSlide 0.2s ease",
          }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: cc.dot, flexShrink: 0 }} />
            {toast.msg}
          </div>
        );
      })}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "grid" },
  { key: "courses", label: "Kurslar", icon: "book", badge: "courses" },
  { key: "course-types", label: "Kurs turlari", icon: "tag" },
  { key: "blogs", label: "Maqolalar", icon: "blog", badge: "blogs" },
  { key: "comments", label: "Izohlar", icon: "chat", badge: "comments" },
  { key: "users", label: "Foydalanuvchilar", icon: "users", badge: "users" },
  { key: "teachers", label: "O'qituvchilar", icon: "teacher" },
  { key: "settings", label: "Sozlamalar", icon: "settings" },
];

function Sidebar({ page, onNav, dark, counts, me, onLogout }) {
  const t = tv(dark);
  return (
    <aside style={{
      width: 226, minWidth: 226, background: t.surface,
      borderRight: `1px solid ${t.border}`,
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 16px 14px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, letterSpacing: -0.3 }}>MyRobo</div>
            <div style={{ fontSize: 11, color: t.muted }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 10px", overflowY: "auto" }}>
        {[
          { title: "Umumiy", items: NAV.slice(0, 1) },
          { title: "Kontent", items: NAV.slice(1, 5) },
          { title: "Tizim", items: NAV.slice(5) },
        ].map(group => (
          <div key={group.title}>
            <div style={{ fontSize: 10, fontWeight: 600, color: t.muted, padding: "10px 8px 6px", letterSpacing: "0.07em", textTransform: "uppercase" }}>
              {group.title}
            </div>
            {group.items.map(n => {
              const active = page === n.key;
              const count = n.badge ? counts[n.badge] : null;
              return (
                <button key={n.key} onClick={() => onNav(n.key)} style={{
                  display: "flex", alignItems: "center", gap: 9,
                  width: "100%", padding: "8px 10px", borderRadius: 9,
                  border: "none", cursor: "pointer", textAlign: "left",
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  color: active ? C.blue : t.muted,
                  background: active ? (dark ? C.blueDark : C.blueLight) : "transparent",
                  marginBottom: 2, transition: "all 0.12s", fontFamily: "inherit",
                }}>
                  <Ico name={n.icon} size={15} color={active ? C.blue : t.muted} />
                  <span style={{ flex: 1 }}>{n.label}</span>
                  {count != null && (
                    <span style={{
                      fontSize: 10, padding: "1px 7px", borderRadius: 20,
                      background: active ? (dark ? "#1e3a6e" : "#dbeafe") : t.faint,
                      color: active ? C.blue : t.muted, fontWeight: 600,
                    }}>{count}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "10px 10px 12px", borderTop: `1px solid ${t.border}` }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 10px", borderRadius: 10, background: t.surface2,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
          }}>{me ? initials(me.first_name || me.username || "A") : "A"}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {me ? (me.first_name || me.username || "Admin") : "Admin"}
            </div>
            <div style={{ fontSize: 10, color: t.muted }}>
              {me?.is_staff ? "Super admin" : "Admin"}
            </div>
          </div>
          <button onClick={onLogout} title="Chiqish" style={{ background: "none", border: "none", cursor: "pointer", color: t.muted, display: "flex" }}>
            <Ico name="logout" size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────
function TopBar({ title, sub, dark, toggleDark, onRefresh, addLabel, onAdd }) {
  const t = tv(dark);
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "13px 24px", background: t.surface, borderBottom: `1px solid ${t.border}`,
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 700, color: t.text, letterSpacing: -0.3 }}>{title}</div>
        <div style={{ fontSize: 12, color: t.muted, marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconBtn name="refresh" onClick={onRefresh} dark={dark} title="Yangilash" />
        <button onClick={toggleDark} title="Tema o'zgartirish" style={{
          width: 34, height: 34, borderRadius: 9,
          border: `1px solid ${tv(dark).border2}`,
          background: tv(dark).surface2, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: tv(dark).muted,
        }}>
          <Ico name={dark ? "sun" : "moon"} size={14} />
        </button>
        {addLabel && (
          <Btn icon="plus" onClick={onAdd}>{addLabel}</Btn>
        )}
      </div>
    </header>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// LOGIN PAGE
// ═════════════════════════════════════════════════════════════════════════════
function LoginPage({ dark, onLogin }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const t = tv(dark);

  const handleLogin = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const data = await apiJson("/user/auth/login/", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      if (data.access) {
        localStorage.setItem(TOKEN_KEY, data.access);
        if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
        onLogin(data.user);
      } else {
        setError("Token kelmadi. Qaytadan urinib ko'ring.");
      }
    } catch (err) {
      setError(err.status === 401 ? "Noto'g'ri kod. Iltimos, qaytadan kiriting." : `Xatolik: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: t.bg,
    }}>
      <div style={{
        background: t.surface, border: `1px solid ${t.border}`,
        borderRadius: 18, padding: "40px 36px", width: 380, maxWidth: "90vw",
      }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: t.text, letterSpacing: -0.5 }}>MyRobo Admin</div>
          <div style={{ fontSize: 13, color: t.muted, marginTop: 4 }}>Tizimga kirish uchun kodni kiriting</div>
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: t.muted, display: "block", marginBottom: 6 }}>Kirish kodi</label>
          <div style={{ position: "relative" }}>
            <Ico name="key" size={15} color={t.muted} />
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              placeholder="Kodni kiriting..."
              style={{
                width: "100%", padding: "10px 12px 10px 36px",
                borderRadius: 10, border: `1px solid ${error ? C.red : t.border2}`,
                background: t.surface2, color: t.text,
                fontSize: 14, outline: "none", fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <Ico name="key" size={15} color={t.muted} />
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            padding: "8px 12px", borderRadius: 8, background: dark ? C.redDark : "#fef2f2",
            border: `1px solid ${dark ? "#4a1515" : "#fecaca"}`,
            color: dark ? "#f87171" : C.red, fontSize: 12, marginBottom: 12,
          }}>{error}</div>
        )}

        <button onClick={handleLogin} disabled={loading || !code.trim()} style={{
          width: "100%", padding: "11px", borderRadius: 10,
          border: "none", background: C.blue, color: "#fff",
          fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
          opacity: (!code.trim() || loading) ? 0.6 : 1, fontFamily: "inherit",
        }}>
          {loading ? "Tekshirilmoqda..." : "Kirish"}
        </button>

        <div style={{ marginTop: 20, padding: "12px", borderRadius: 9, background: t.surface2, fontSize: 12, color: t.muted, lineHeight: 1.6 }}>
          <strong style={{ color: t.text }}>API:</strong> POST /user/auth/login/ — body: {`{ "code": "..." }`}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
function Dashboard({ data, dark, me }) {
  const { blogs, courseTypes, courses, teachers, loading } = data;
  const t = tv(dark);
  const totalViews = blogs.reduce((s, b) => s + (b.views || 0), 0);
  const recent = [...blogs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);

  return (
    <div style={{ padding: "20px 24px" }}>
      {/* Welcome */}
      <div style={{ marginBottom: 20, padding: "16px 20px", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.text }}>
              Xush kelibsiz, {me?.first_name || me?.username || "Admin"}! 👋
            </div>
            <div style={{ fontSize: 13, color: t.muted, marginTop: 3 }}>MyRobo platformasi — bugungi holat</div>
          </div>
          <div style={{
            padding: "8px 14px", borderRadius: 9, background: dark ? C.blueDark : C.blueLight,
            fontSize: 12, fontWeight: 600, color: C.blue,
          }}>
            {new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 20 }}>
        <StatCard label="Jami maqolalar" value={num(blogs.length)} icon="blog" accent="blue" dark={dark} />
        <StatCard label="Kurslar" value={num(courses.length)} icon="book" accent="green" dark={dark} />
        <StatCard label="Kurs turlari" value={num(courseTypes.length)} icon="tag" accent="purple" dark={dark} />
        <StatCard label="Ko'rishlar" value={num(totalViews)} icon="eye" accent="amber" dark={dark} />
        <StatCard label="O'qituvchilar" value={num(teachers.length)} icon="teacher" accent="red" dark={dark} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 14 }}>
        {/* Recent blogs */}
        <Card dark={dark}>
          <CardHead dark={dark}>
            <CardTitle dark={dark}>So'nggi maqolalar</CardTitle>
            <Badge label={`${blogs.length} ta`} color="blue" dark={dark} />
          </CardHead>
          {loading ? (
            <div style={{ padding: 30, textAlign: "center", color: t.muted, fontSize: 13 }}>Yuklanmoqda...</div>
          ) : recent.map((b, i) => (
            <div key={b.id || b.slug} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 18px",
              borderBottom: i < recent.length - 1 ? `1px solid ${t.border}` : "none",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9, background: dark ? C.blueDark : C.blueLight,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Ico name="blog" size={15} color={C.blue} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {b.title || "Sarlavsiz"}
                </div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{fmt(b.created_at)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: t.muted, flexShrink: 0 }}>
                <Ico name="eye" size={12} />
                {b.views || 0}
              </div>
            </div>
          ))}
        </Card>

        {/* Courses list */}
        <Card dark={dark}>
          <CardHead dark={dark}>
            <CardTitle dark={dark}>Kurslar</CardTitle>
            <Badge label={`${courses.length} ta`} color="green" dark={dark} />
          </CardHead>
          {courses.slice(0, 6).map((c, i) => (
            <div key={c.id} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 18px",
              borderBottom: i < Math.min(courses.length, 6) - 1 ? `1px solid ${t.border}` : "none",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, background: dark ? C.greenDark : C.greenLight,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Ico name="book" size={14} color={C.green} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: t.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 11, color: t.muted }}>{num(c.price)} so'm</div>
              </div>
              <Badge label={`${c.buyers_total || 0} ta`} color="gray" dark={dark} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COURSES PAGE
// ═════════════════════════════════════════════════════════════════════════════
function CoursesPage({ courses, courseTypes, dark, toast }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const filtered = courses.filter(c => {
    const q = search.toLowerCase();
    const matchQ = !q || (c.title || "").toLowerCase().includes(q);
    const matchT = !typeFilter || c.course_type_id === typeFilter;
    return matchQ && matchT;
  });

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cols = [
    { key: "n", label: "#", width: 40, render: (r) => paged.indexOf(r) + 1 + (page - 1) * PAGE_SIZE },
    {
      key: "title", label: "Kurs nomi", render: (c) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {c.image ? (
            <img src={c.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: 8, background: dark ? C.greenDark : C.greenLight, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Ico name="book" size={15} color={C.green} />
            </div>
          )}
          <div>
            <div style={{ fontWeight: 500, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.title}</div>
            <div style={{ fontSize: 11, color: tv(dark).muted }}>{c.slug}</div>
          </div>
        </div>
      )
    },
    { key: "price", label: "Narxi", render: (c) => <span style={{ fontWeight: 600, color: C.green }}>{num(c.price)} so'm</span> },
    { key: "buyers", label: "O'quvchilar", render: (c) => (
      <div>
        <div style={{ fontSize: 13 }}>{num(c.buyers_total || 0)} jami</div>
        <div style={{ fontSize: 11, color: tv(dark).muted }}>{num(c.buyers_active || 0)} faol</div>
      </div>
    )},
    { key: "sections", label: "Bo'limlar", render: (c) => <Badge label={`${c.sections_count || 0} ta`} color="blue" dark={dark} /> },
    { key: "topics", label: "Mavzular", render: (c) => <Badge label={`${c.topics_count || 0} ta`} color="purple" dark={dark} /> },
    { key: "status", label: "Holat", render: (c) => <Badge label={c.is_active ? "Faol" : "Nofaol"} color={c.is_active ? "green" : "red"} dark={dark} /> },
    {
      key: "actions", label: "Amallar", width: 70, render: (c) => (
        <div style={{ display: "flex", gap: 4 }}>
          <IconBtn name="eye" onClick={() => setSelected(c)} dark={dark} title="Batafsil" />
          <IconBtn name="external" onClick={() => window.open(`https://myrobo.adxamov.uz/courses/${c.slug || c.id}`, "_blank")} dark={dark} title="Saytda ko'rish" />
        </div>
      )
    },
  ];

  return (
    <div style={{ padding: "20px 24px" }}>
      <Card dark={dark}>
        <CardHead dark={dark}>
          <CardTitle dark={dark}>Kurslar ({filtered.length} ta)</CardTitle>
          <div style={{ display: "flex", gap: 8 }}>
            <Search value={search} onChange={v => { setSearch(v); setPage(1); }} dark={dark} />
            <Select value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} dark={dark}>
              <option value="">Barcha turlar</option>
              {courseTypes.map(ct => <option key={ct.id} value={ct.id}>{ct.title}</option>)}
            </Select>
          </div>
        </CardHead>
        <Table cols={cols} rows={paged} dark={dark} empty="Kurslar topilmadi" />
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} dark={dark} />
      </Card>

      {/* Course Detail Modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Kurs tafsilotlari" dark={dark}>
        {selected && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                ["ID", selected.id],
                ["Narx", `${num(selected.price)} so'm`],
                ["Jami o'quvchi", selected.buyers_total || 0],
                ["Faol o'quvchi", selected.buyers_active || 0],
                ["Bo'limlar", selected.sections_count || 0],
                ["Mavzular", selected.topics_count || 0],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "8px 12px", borderRadius: 8, background: tv(dark).surface2 }}>
                  <div style={{ fontSize: 10, color: tv(dark).muted, marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: tv(dark).text }}>{v}</div>
                </div>
              ))}
            </div>
            {selected.about && (
              <div style={{ padding: "10px 12px", borderRadius: 8, background: tv(dark).surface2, fontSize: 12, color: tv(dark).muted, lineHeight: 1.6 }}>
                {selected.about}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COURSE TYPES PAGE
// ═════════════════════════════════════════════════════════════════════════════
function CourseTypesPage({ courseTypes, setCourseTypes, courses, dark, toast }) {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      const ct = await apiJson("/courses/course-types/", {
        method: "POST",
        body: JSON.stringify({ title: name, slug: slug || name.toLowerCase().replace(/\s+/g, "-") }),
      });
      setCourseTypes(p => [...p, ct]);
      setName(""); setSlug(""); setShowAdd(false);
      toast("Kurs turi qo'shildi", "success");
    } catch { toast("Xatolik yuz berdi", "error"); }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    try {
      await apiFetch(`/courses/course-types/${confirmDel.id}/`, { method: "DELETE" });
      setCourseTypes(p => p.filter(c => c.id !== confirmDel.id));
      toast("Kurs turi o'chirildi", "success");
    } catch { toast("O'chirishda xatolik", "error"); }
    setConfirmDel(null);
  };

  const t = tv(dark);
  const colors = ["blue", "green", "amber", "purple", "red", "gray"];

  return (
    <div style={{ padding: "20px 24px" }}>
      {showAdd && (
        <Card dark={dark} style={{ marginBottom: 14 }}>
          <CardHead dark={dark}>
            <CardTitle dark={dark}>Yangi kurs turi</CardTitle>
          </CardHead>
          <div style={{ padding: "16px 18px", display: "flex", gap: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: "block", marginBottom: 5 }}>Nomi *</label>
              <Input value={name} onChange={v => { setName(v); setSlug(v.toLowerCase().replace(/\s+/g, "-")); }} placeholder="Kurs turi nomi" dark={dark} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: "block", marginBottom: 5 }}>Slug</label>
              <Input value={slug} onChange={setSlug} placeholder="avto-slug" dark={dark} />
            </div>
            <Btn onClick={handleAdd} disabled={saving || !name.trim()}>{saving ? "Saqlanmoqda..." : "Saqlash"}</Btn>
            <Btn variant="ghost" dark={dark} onClick={() => setShowAdd(false)}>Bekor</Btn>
          </div>
        </Card>
      )}

      {!showAdd && (
        <div style={{ marginBottom: 12, display: "flex", justifyContent: "flex-end" }}>
          <Btn icon="plus" onClick={() => setShowAdd(true)}>Kurs turi qo'shish</Btn>
        </div>
      )}

      <Card dark={dark}>
        <CardHead dark={dark}>
          <CardTitle dark={dark}>Kurs turlari ({courseTypes.length} ta)</CardTitle>
        </CardHead>
        <Table
          dark={dark}
          empty="Kurs turlari yo'q"
          cols={[
            { key: "n", label: "#", width: 40, render: (_, i) => i + 1 },
            { key: "title", label: "Nomi", render: (ct, i) => <Badge label={ct.title} color={colors[i % colors.length]} dark={dark} /> },
            { key: "slug", label: "Slug", render: (ct) => <code style={{ fontSize: 12, color: t.muted }}>{ct.slug}</code> },
            { key: "count", label: "Kurslar", render: (ct) => {
              const c = courses.filter(c => c.course_type_id === ct.id).length;
              return <Badge label={`${c} ta`} color="gray" dark={dark} />;
            }},
            {
              key: "api", label: "API URL", render: (ct) => (
                <code style={{ fontSize: 11, color: t.muted }}>/courses/course-types/{ct.id}/courses/</code>
              )
            },
            {
              key: "act", label: "Amallar", width: 80, render: (ct) => (
                <div style={{ display: "flex", gap: 4 }}>
                  <IconBtn name="external" onClick={() => window.open(`https://myrobo.adxamov.uz/courses/course-types/${ct.id}/courses/`, "_blank")} dark={dark} title="API ko'rish" />
                  <IconBtn name="trash" danger onClick={() => setConfirmDel(ct)} dark={dark} title="O'chirish" />
                </div>
              )
            },
          ]}
          rows={courseTypes.map((ct, i) => ({ ...ct, _i: i }))}
        />
      </Card>

      <ConfirmModal
        open={!!confirmDel}
        title="Kurs turini o'chirish"
        desc={`"${confirmDel?.title}" kurs turini o'chirasizmi? Bog'liq kurslar ham ta'sirlanishi mumkin.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDel(null)}
        dark={dark}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// BLOGS PAGE
// ═════════════════════════════════════════════════════════════════════════════
function BlogsPage({ blogs, setBlogs, dark, toast }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editTarget, setEditTarget] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDel, setConfirmDel] = useState(null);
  const t = tv(dark);

  const filtered = blogs.filter(b => {
    const q = search.toLowerCase();
    return !q || (b.title || "").toLowerCase().includes(q) || (b.slug || "").toLowerCase().includes(q);
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const startEdit = (b) => { setEditTarget(b); setEditTitle(b.title || ""); setEditDesc(b.description || b.about || ""); };

  const saveEdit = async () => {
    if (!editTarget) return;
    setSaving(true);
    try {
      const updated = await apiJson(`/blog/blogs/${editTarget.slug}/`, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle, description: editDesc }),
      });
      setBlogs(p => p.map(b => b.slug === editTarget.slug ? { ...b, ...updated } : b));
      setEditTarget(null);
      toast("Maqola yangilandi", "success");
    } catch { toast("Yangilashda xatolik", "error"); }
    setSaving(false);
  };

  const deleteBlog = async () => {
    if (!confirmDel) return;
    try {
      const res = await apiFetch(`/blog/blogs/${confirmDel.slug}/`, { method: "DELETE" });
      if (res.ok || res.status === 204) {
        setBlogs(p => p.filter(b => b.slug !== confirmDel.slug));
        toast("Maqola o'chirildi", "success");
      } else throw new Error();
    } catch { toast("O'chirishda xatolik", "error"); }
    setConfirmDel(null);
  };

  const cols = [
    { key: "n", label: "#", width: 40, render: (b) => paged.indexOf(b) + 1 + (page - 1) * PAGE_SIZE },
    {
      key: "title", label: "Sarlavha", render: (b) => (
        <div>
          <div style={{ fontWeight: 500, maxWidth: 220, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{b.title || "—"}</div>
          <div style={{ fontSize: 11, color: t.muted }}>{b.slug}</div>
        </div>
      )
    },
    {
      key: "views", label: "Ko'rishlar", render: (b) => (
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Ico name="eye" size={12} color={t.muted} />
          {b.views || 0}
        </div>
      )
    },
    { key: "date", label: "Sana", render: (b) => fmt(b.created_at) },
    { key: "status", label: "Holat", render: (b) => <Badge label={b.is_active !== false ? "Faol" : "Nofaol"} color={b.is_active !== false ? "green" : "red"} dark={dark} /> },
    {
      key: "actions", label: "Amallar", width: 100, render: (b) => (
        <div style={{ display: "flex", gap: 4 }}>
          <IconBtn name="edit" onClick={() => startEdit(b)} dark={dark} title="Tahrirlash" />
          <IconBtn name="external" onClick={() => window.open(`https://myrobo.adxamov.uz/blog/${b.slug}`, "_blank")} dark={dark} title="Saytda ko'rish" />
          <IconBtn name="trash" danger onClick={() => setConfirmDel(b)} dark={dark} title="O'chirish" />
        </div>
      )
    },
  ];

  return (
    <div style={{ padding: "20px 24px" }}>
      <Card dark={dark}>
        <CardHead dark={dark}>
          <CardTitle dark={dark}>Maqolalar ({filtered.length} ta)</CardTitle>
          <Search value={search} onChange={v => { setSearch(v); setPage(1); }} dark={dark} />
        </CardHead>
        <Table cols={cols} rows={paged} dark={dark} empty="Maqolalar topilmadi" />
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} dark={dark} />
      </Card>

      {/* Edit Modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Maqolani tahrirlash" dark={dark}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: "block", marginBottom: 5 }}>Sarlavha</label>
            <Input value={editTitle} onChange={setEditTitle} placeholder="Maqola sarlavhasi" dark={dark} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: "block", marginBottom: 5 }}>Tavsif</label>
            <textarea
              value={editDesc} onChange={e => setEditDesc(e.target.value)}
              placeholder="Maqola tavsifi..." rows={4}
              style={{
                width: "100%", padding: "8px 12px", borderRadius: 9,
                border: `1px solid ${t.border2}`, background: t.surface2, color: t.text,
                fontSize: 13, outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="ghost" dark={dark} onClick={() => setEditTarget(null)}>Bekor</Btn>
            <Btn icon="save" onClick={saveEdit} disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</Btn>
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={!!confirmDel}
        title="Maqolani o'chirish"
        desc={`"${confirmDel?.title}" maqolasini o'chirasizmi? Bu amal qaytarib bo'lmaydi.`}
        onConfirm={deleteBlog}
        onCancel={() => setConfirmDel(null)}
        dark={dark}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// COMMENTS PAGE
// ═════════════════════════════════════════════════════════════════════════════
function CommentsPage({ blogs, dark, toast, onCountUpdate }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogFilter, setBlogFilter] = useState("");
  const [page, setPage] = useState(1);
  const [confirmDel, setConfirmDel] = useState(null);
  const loaded = useRef(new Set());

  const loadComments = useCallback(async (slug, title) => {
    if (loaded.current.has(slug)) return;
    loaded.current.add(slug);
    try {
      const res = await apiFetch(`/blog/blogs/${slug}/comments/`);
      if (!res.ok) return;
      const data = await res.json();
      const arr = (Array.isArray(data) ? data : data.results || []).map(c => ({ ...c, _slug: slug, _title: title }));
      setComments(p => [...p.filter(c => c._slug !== slug), ...arr]);
    } catch {}
  }, []);

  useEffect(() => {
    if (!blogs.length) return;
    setLoading(true);
    Promise.all(blogs.slice(0, 15).map(b => loadComments(b.slug, b.title))).finally(() => setLoading(false));
  }, [blogs]);

  useEffect(() => { onCountUpdate?.(comments.length); }, [comments]);

  const filtered = blogFilter ? comments.filter(c => c._slug === blogFilter) : comments;
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const doDelete = async () => {
    const c = confirmDel;
    if (!c) return;
    let ok = false;
    for (const path of [`/blog/blogs/${c._slug}/comments/${c.id}/`, `/blog/comments/${c.id}/`]) {
      try {
        const res = await apiFetch(path, { method: "DELETE" });
        if (res.ok || res.status === 204) { ok = true; break; }
      } catch {}
    }
    if (ok) { setComments(p => p.filter(x => x.id !== c.id)); toast("Izoh o'chirildi", "success"); }
    else toast("O'chirishda xatolik", "error");
    setConfirmDel(null);
  };

  const cols = [
    { key: "n", label: "#", width: 40, render: (c) => filtered.indexOf(c) + 1 },
    {
      key: "author", label: "Foydalanuvchi", render: (c) => {
        const name = c.author || c.user || "Noma'lum";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>{name[0]?.toUpperCase()}</div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{name}</span>
          </div>
        );
      }
    },
    { key: "blog", label: "Blog", render: (c) => <Badge label={c._title || c._slug} color="blue" dark={dark} /> },
    {
      key: "content", label: "Matn", render: (c) => (
        <div style={{ maxWidth: 250, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 13, color: tv(dark).muted }}>
          {c.content || c.text || c.comment || "—"}
        </div>
      )
    },
    { key: "date", label: "Sana", render: (c) => fmt(c.created_at) },
    {
      key: "act", label: "Amallar", width: 60, render: (c) => (
        <IconBtn name="trash" danger onClick={() => setConfirmDel(c)} dark={dark} title="O'chirish" />
      )
    },
  ];

  return (
    <div style={{ padding: "20px 24px" }}>
      <Card dark={dark}>
        <CardHead dark={dark}>
          <CardTitle dark={dark}>Izohlar ({filtered.length} ta)</CardTitle>
          <Select value={blogFilter} onChange={v => { setBlogFilter(v); setPage(1); }} dark={dark}>
            <option value="">Barcha bloglar</option>
            {blogs.slice(0, 15).map(b => <option key={b.slug} value={b.slug}>{b.title || b.slug}</option>)}
          </Select>
        </CardHead>
        <Table cols={cols} rows={paged} dark={dark} loading={loading} empty="Izohlar topilmadi" />
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} dark={dark} />
      </Card>
      <ConfirmModal
        open={!!confirmDel}
        title="Izohni o'chirish"
        desc="Bu izohni o'chirasizmi? Amal qaytarib bo'lmaydi."
        onConfirm={doDelete}
        onCancel={() => setConfirmDel(null)}
        dark={dark}
      />
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// USERS PAGE
// ═════════════════════════════════════════════════════════════════════════════
function UsersPage({ users, usersError, dark, toast, refresh }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || (u.username || "").toLowerCase().includes(q) || (u.first_name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q) || (u.phone || "").includes(q);
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleBlock = async (u) => {
    try {
      await apiJson(`/user/auth/users/${u.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ is_active: !u.is_active }),
      });
      toast(`Foydalanuvchi ${u.is_active ? "bloklandi" : "faollashtirildi"}`, "success");
      refresh?.();
    } catch { toast("Amal bajarib bo'lmadi", "error"); }
  };

  const t = tv(dark);

  const cols = [
    { key: "n", label: "#", width: 40, render: (u) => paged.indexOf(u) + 1 + (page - 1) * PAGE_SIZE },
    {
      key: "user", label: "Foydalanuvchi", render: (u) => {
        const name = u.first_name ? `${u.first_name} ${u.last_name || ""}`.trim() : u.username || "—";
        const hue = (name.charCodeAt(0) * 17) % 360;
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `hsl(${hue}, 55%, ${dark ? 35 : 60}%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0,
            }}>{initials(name)}</div>
            <div>
              <div style={{ fontWeight: 500, fontSize: 13 }}>{name}</div>
              <div style={{ fontSize: 11, color: t.muted }}>@{u.username}</div>
            </div>
          </div>
        );
      }
    },
    { key: "phone", label: "Telefon", render: (u) => <span style={{ fontSize: 13, fontFamily: "monospace" }}>{u.phone || u.phone_number || "—"}</span> },
    { key: "balance", label: "Balans", render: (u) => <span style={{ fontWeight: 600, color: C.green }}>{num(u.balance || 0)} so'm</span> },
    { key: "joined", label: "Qo'shilgan", render: (u) => fmt(u.date_joined || u.created_at) },
    { key: "staff", label: "Rol", render: (u) => <Badge label={u.is_staff ? "Admin" : "Foydalanuvchi"} color={u.is_staff ? "red" : "gray"} dark={dark} /> },
    { key: "active", label: "Holat", render: (u) => <Badge label={u.is_active ? "Faol" : "Bloklangan"} color={u.is_active ? "green" : "red"} dark={dark} /> },
    {
      key: "actions", label: "Amallar", width: 80, render: (u) => (
        <div style={{ display: "flex", gap: 4 }}>
          <IconBtn name="user" onClick={() => setSelected(u)} dark={dark} title="Batafsil" />
          <IconBtn name={u.is_active ? "ban" : "check"} onClick={() => toggleBlock(u)} dark={dark} danger={u.is_active} title={u.is_active ? "Bloklash" : "Faollashtirish"} />
        </div>
      )
    },
  ];

  return (
    <div style={{ padding: "20px 24px" }}>
      {usersError && (
        <div style={{
          padding: "12px 16px", borderRadius: 10, marginBottom: 14,
          background: dark ? C.amberDark : C.amberLight,
          border: `1px solid ${dark ? "#5a3800" : "#fcd34d"}`,
          color: dark ? "#fbbf24" : C.amber, fontSize: 13,
        }}>
          ⚠️ Foydalanuvchilar API mavjud emas (<code>/user/auth/users/</code>). Backend tomonida sozlash kerak.
        </div>
      )}
      <Card dark={dark}>
        <CardHead dark={dark}>
          <CardTitle dark={dark}>Foydalanuvchilar ({filtered.length} ta)</CardTitle>
          <Search value={search} onChange={v => { setSearch(v); setPage(1); }} dark={dark} />
        </CardHead>
        <Table cols={cols} rows={paged} dark={dark} empty={usersError ? "Foydalanuvchilarni yuklab bo'lmadi" : "Foydalanuvchilar topilmadi"} />
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} dark={dark} />
      </Card>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Foydalanuvchi ma'lumotlari" dark={dark}>
        {selected && (
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, padding: "12px", borderRadius: 10, background: tv(dark).surface2 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 700, color: "#fff",
              }}>{initials(selected.first_name || selected.username)}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: tv(dark).text }}>{selected.first_name} {selected.last_name}</div>
                <div style={{ fontSize: 13, color: tv(dark).muted }}>@{selected.username}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["📱 Telefon", selected.phone || selected.phone_number || "—"],
                ["💰 Balans", `${num(selected.balance || 0)} so'm`],
                ["📅 Qo'shilgan", fmt(selected.date_joined || selected.created_at)],
                ["🔐 Staff", selected.is_staff ? "Ha" : "Yo'q"],
                ["✅ Faol", selected.is_active ? "Ha" : "Bloklangan"],
                ["🆔 ID", selected.id?.toString().slice(0, 16) + "..."],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: "8px 10px", borderRadius: 8, background: tv(dark).surface2 }}>
                  <div style={{ fontSize: 11, color: tv(dark).muted }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: tv(dark).text, marginTop: 2 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// TEACHERS PAGE
// ═════════════════════════════════════════════════════════════════════════════
function TeachersPage({ teachers, dark }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const t = tv(dark);

  const filtered = teachers.filter(tc => {
    const q = search.toLowerCase();
    return !q || (tc.name || tc.full_name || "").toLowerCase().includes(q);
  });
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const cols = [
    { key: "n", label: "#", width: 40, render: (tc) => paged.indexOf(tc) + 1 + (page - 1) * PAGE_SIZE },
    {
      key: "name", label: "Ism", render: (tc) => {
        const name = tc.full_name || tc.name || "—";
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {tc.avatar ? (
              <img src={tc.avatar} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: `hsl(${(name.charCodeAt(0) * 23) % 360}, 55%, ${dark ? 35 : 60}%)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>{initials(name)}</div>
            )}
            <span style={{ fontWeight: 500, fontSize: 13 }}>{name}</span>
          </div>
        );
      }
    },
    { key: "about", label: "Haqida", render: (tc) => (
      <div style={{ maxWidth: 260, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontSize: 12, color: t.muted }}>
        {tc.about || tc.bio || "—"}
      </div>
    )},
    { key: "id", label: "ID", render: (tc) => <code style={{ fontSize: 11, color: t.muted }}>{tc.id?.toString().slice(0, 8)}...</code> },
  ];

  return (
    <div style={{ padding: "20px 24px" }}>
      <Card dark={dark}>
        <CardHead dark={dark}>
          <CardTitle dark={dark}>O'qituvchilar ({filtered.length} ta)</CardTitle>
          <Search value={search} onChange={v => { setSearch(v); setPage(1); }} dark={dark} />
        </CardHead>
        <Table cols={cols} rows={paged} dark={dark} empty="O'qituvchilar topilmadi" />
        <Pagination page={page} total={filtered.length} pageSize={PAGE_SIZE} onChange={setPage} dark={dark} />
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE
// ═════════════════════════════════════════════════════════════════════════════
function SettingsPage({ dark, toast, me }) {
  const [fname, setFname] = useState(me?.first_name || "");
  const [lname, setLname] = useState(me?.last_name || "");
  const [saving, setSaving] = useState(false);
  const t = tv(dark);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await apiJson("/user/auth/me/", {
        method: "PATCH",
        body: JSON.stringify({ first_name: fname, last_name: lname }),
      });
      toast("Profil yangilandi", "success");
    } catch { toast("Yangilashda xatolik", "error"); }
    setSaving(false);
  };

  const clearCache = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const refresh = localStorage.getItem("refresh_token");
    localStorage.clear();
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (refresh) localStorage.setItem("refresh_token", refresh);
    toast("Kesh tozalandi (token saqlab qolindi)", "success");
  };

  const label = txt => <label style={{ fontSize: 11, fontWeight: 600, color: t.muted, display: "block", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.05em" }}>{txt}</label>;

  return (
    <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Profile */}
      <Card dark={dark}>
        <CardHead dark={dark}><CardTitle dark={dark}>Profil ma'lumotlari</CardTitle></CardHead>
        <div style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "14px 16px", borderRadius: 10, background: t.surface2 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 700, color: "#fff",
            }}>{initials(me?.first_name || me?.username || "A")}</div>
            <div>
              <div style={{ fontWeight: 600, color: t.text }}>{me?.first_name} {me?.last_name}</div>
              <div style={{ fontSize: 12, color: t.muted }}>@{me?.username} · {me?.is_staff ? "Staff" : "Foydalanuvchi"}</div>
              <div style={{ fontSize: 11, color: t.muted }}>📱 {me?.phone || "—"}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>{label("Ism")}<Input value={fname} onChange={setFname} dark={dark} placeholder="Ismingiz" /></div>
            <div>{label("Familiya")}<Input value={lname} onChange={setLname} dark={dark} placeholder="Familiyangiz" /></div>
          </div>
          <Btn icon="save" onClick={saveProfile} disabled={saving}>{saving ? "Saqlanmoqda..." : "Saqlash"}</Btn>
        </div>
      </Card>

      {/* API Info */}
      <Card dark={dark}>
        <CardHead dark={dark}><CardTitle dark={dark}>API va token ma'lumotlari</CardTitle></CardHead>
        <div style={{ padding: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              {label("API manzil")}
              <div style={{ padding: "8px 12px", borderRadius: 9, background: t.surface2, border: `1px solid ${t.border}`, fontSize: 13, fontFamily: "monospace", color: t.muted }}>{API}/</div>
            </div>
            <div>
              {label("Access token")}
              <div style={{ padding: "8px 12px", borderRadius: 9, background: t.surface2, border: `1px solid ${t.border}`, fontSize: 12, fontFamily: "monospace", color: t.muted, wordBreak: "break-all" }}>
                {getToken() ? getToken().slice(0, 30) + "..." : "Token yo'q"}
              </div>
            </div>
          </div>
          <div style={{
            padding: "12px 14px", borderRadius: 10, background: dark ? "#1a2035" : "#f0f9ff",
            border: `1px solid ${dark ? "#1e3a5f" : "#bae6fd"}`, fontSize: 12, color: dark ? "#7dd3fc" : "#0369a1", lineHeight: 1.8
          }}>
            <strong>API endpointlar:</strong><br />
            GET /user/auth/me/ — profil ma'lumotlari<br />
            PATCH /user/auth/me/ — profilni yangilash<br />
            GET /blog/blogs/ — barcha maqolalar<br />
            GET /courses/courses/ — barcha kurslar<br />
            GET /courses/course-types/ — kurs turlari<br />
            GET /teacher/teachers/ — o'qituvchilar
          </div>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card dark={dark}>
        <CardHead dark={dark}><CardTitle dark={dark}>Xavfli zona</CardTitle></CardHead>
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: 13, color: t.muted, marginBottom: 14, lineHeight: 1.6 }}>
            Kesh tozalash — token saqlanadi, qolgan mahalliy ma'lumotlar o'chiriladi.
          </p>
          <Btn variant="danger" icon="trash" onClick={clearCache}>Keshni tozalash</Btn>
        </div>
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN
// ═════════════════════════════════════════════════════════════════════════════
const PAGE_META = {
  dashboard: ["Dashboard", "MyRobo platformasi statistikasi"],
  courses: ["Kurslar", "Barcha kurslarni boshqarish"],
  "course-types": ["Kurs turlari", "Kurs turlarini boshqarish"],
  blogs: ["Maqolalar", "Blog maqolalarini boshqarish"],
  comments: ["Izohlar", "Foydalanuvchi izohlarini moderatsiya qilish"],
  users: ["Foydalanuvchilar", "Foydalanuvchilarni boshqarish"],
  teachers: ["O'qituvchilar", "O'qituvchilar ro'yxati"],
  settings: ["Sozlamalar", "Tizim va profil sozlamalari"],
};

const ADD_LABELS = {
  blogs: "Maqola qo'shish",
  "course-types": "Kurs turi qo'shish",
};

export default function AdminPanel() {
  const [dark, toggleDark] = useTheme();
  const [toasts, toast] = useToast();
  const [page, setPage] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [me, setMe] = useState(null);

  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load fonts
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap";
    document.head.appendChild(link);
  }, []);

  const fetchMe = useCallback(async () => {
    try { const d = await apiJson("/user/auth/me/"); setMe(d); } catch {}
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [blogsR, coursesR, ctR] = await Promise.all([
        apiJson("/blog/blogs/"),
        apiJson("/courses/courses/"),
        apiJson("/courses/course-types/"),
      ]);
      setBlogs(Array.isArray(blogsR) ? blogsR : blogsR.results || []);
      setCourses(Array.isArray(coursesR) ? coursesR : coursesR.results || []);
      setCourseTypes(Array.isArray(ctR) ? ctR : ctR.results || []);
    } catch (err) { toast("Ma'lumot yuklashda xatolik", "error"); }

    try {
      const tr = await apiJson("/teacher/teachers/");
      setTeachers(Array.isArray(tr) ? tr : tr.results || []);
    } catch {}

    setUsersError(null);
    try {
      const ur = await apiJson("/user/auth/users/");
      setUsers(Array.isArray(ur) ? ur : ur.results || []);
    } catch (err) {
      setUsersError(err.status === 404 ? "missing" : "error");
      setUsers([]);
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (isLoggedIn) { fetchMe(); fetchAll(); }
  }, [isLoggedIn]);

  const handleLogin = (user) => {
    setIsLoggedIn(true);
    if (user) setMe(user);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("refresh_token");
    setIsLoggedIn(false);
    setMe(null);
    setBlogs([]); setCourses([]); setCourseTypes([]); setTeachers([]); setUsers([]);
    toast("Tizimdan chiqildi", "info");
  };

  const t = tv(dark);
  const counts = {
    courses: courses.length,
    "course-types": courseTypes.length,
    blogs: blogs.length,
    comments: commentCount,
    users: users.length,
    teachers: teachers.length,
  };

  if (!isLoggedIn) {
    return (
      <>
        <style>{`@keyframes fadeSlide { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }`}</style>
        <ToastList toasts={toasts} dark={dark} />
        <LoginPage dark={dark} onLogin={handleLogin} />
      </>
    );
  }

  const [title, sub] = PAGE_META[page] || ["", ""];

  return (
    <>
      <style>{`
        @keyframes fadeSlide { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${dark ? "#2d3650" : "#d1d9e6"}; border-radius: 10px; }
        tr:hover td { background: ${dark ? "#1a2035" : "#f8fafc"}; }
        button:hover { filter: brightness(1.05); }
      `}</style>
      <ToastList toasts={toasts} dark={dark} />

      <div style={{
        display: "flex", height: "100vh", overflow: "hidden",
        background: t.bg, fontFamily: "'DM Sans', sans-serif",
      }}>
        <Sidebar page={page} onNav={setPage} dark={dark} counts={counts} me={me} onLogout={handleLogout} />

        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <TopBar
            title={title} sub={sub} dark={dark} toggleDark={toggleDark}
            onRefresh={() => { fetchMe(); fetchAll(); }}
            addLabel={ADD_LABELS[page]}
            onAdd={() => {}}
          />
          <div style={{ flex: 1, overflowY: "auto" }}>
            {page === "dashboard" && <Dashboard data={{ blogs, courses, courseTypes, teachers, loading }} dark={dark} me={me} />}
            {page === "courses" && <CoursesPage courses={courses} courseTypes={courseTypes} dark={dark} toast={toast} />}
            {page === "course-types" && <CourseTypesPage courseTypes={courseTypes} setCourseTypes={setCourseTypes} courses={courses} dark={dark} toast={toast} />}
            {page === "blogs" && <BlogsPage blogs={blogs} setBlogs={setBlogs} dark={dark} toast={toast} />}
            {page === "comments" && <CommentsPage blogs={blogs} dark={dark} toast={toast} onCountUpdate={setCommentCount} />}
            {page === "users" && <UsersPage users={users} usersError={usersError} dark={dark} toast={toast} refresh={fetchAll} />}
            {page === "teachers" && <TeachersPage teachers={teachers} dark={dark} />}
            {page === "settings" && <SettingsPage dark={dark} toast={toast} me={me} />}
          </div>
        </div>
      </div>
    </>
  );
}