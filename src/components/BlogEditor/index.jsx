import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, Eye, Edit3, Tag } from "lucide-react";
import { notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill.css";
import "../blog2/blog-content.css";
import { Helmet } from 'react-helmet-async';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["blockquote", "code-block"],
    ["link", "image", "video"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "align",
  "list", "bullet", "indent",
  "blockquote", "code-block",
  "link", "image", "video",
];

export default function BlogEditor({ onClose }) {
  const [title, setTitle] = useState("");
  const [banner, setBanner] = useState(null);
  const [editorData, setEditorData] = useState("");
  const [preview, setPreview] = useState(false);
  const [load, setLoad] = useState(false);

  // Category state
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  const fileRef = useRef(null);
  const token = localStorage.getItem("token");

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCatLoading(true);
      try {
        const res = await fetch("https://api.myrobo.uz/blog/categories/");
        if (!res.ok) throw new Error();
        const data = await res.json();
        // data may be array or { results: [] }
        setCategories(Array.isArray(data) ? data : data.results ?? []);
      } catch {
        notification.error({ message: "Kategoriyalarni yuklashda xatolik" });
      } finally {
        setCatLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const onBanner = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBanner({ url: URL.createObjectURL(file), file });
  };

  const dropBanner = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/"))
      setBanner({ url: URL.createObjectURL(file), file });
  }, []);

  const handleSubmit = async () => {
    if (!title.trim()) return notification.error({ message: "Sarlavha majburiy" });
    if (!selectedCategory) return notification.error({ message: "Kategoriya majburiy" });
    if (!editorData.trim()) return notification.error({ message: "Kontent majburiy" });
    if (!banner?.file) return notification.error({ message: "Banner rasm majburiy" });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", selectedCategory);
    formData.append("description", editorData);
    formData.append("img", banner.file);

    setLoad(true);
    try {
      const res = await fetch("https://api.myrobo.uz/blog/blog-create/", {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      notification.success({ message: "Muvaffaqiyatli nashr qilindi!" });
      onClose?.();
    } catch {
      notification.error({ message: "Post yuborishda xatolik" });
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Maqola qo'shish - MyRobo</title>
        <meta name="description" content="MyRobo blogiga yangi maqola qo'shing." />
        <meta name="keywords" content="maqola qo'shish, blog, yozish, MyRobo" />
        <meta property="og:title" content="Maqola qo'shish - MyRobo" />
        <meta property="og:description" content="MyRobo blogiga yangi maqola qo'shing." />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="flex items-center justify-center p-4">
      <div className="relative rounded-3xl flex flex-col w-full max-w-3xl gap-2">

        {/* Header */}
        <div
          className="flex items-center justify-between px-7 p-4 pt-6 pb-4 border-b"
          style={{ borderColor: "rgba(160,180,255,0.25)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }}
            >
              <Edit3 size={13} color="#fff" />
            </div>
            <span className="font-semibold text-sm tracking-wide" style={{ color: "#c5cfe8" }}>
              Yangi maqola
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                background: preview ? "rgba(79,110,247,0.2)" : "rgba(255,255,255,0.05)",
                color: preview ? "#7fa4ff" : "#8892aa",
                border: `1px solid ${preview ? "rgba(79,110,247,0.5)" : "rgba(200,210,255,0.2)"}`,
              }}
            >
              <Eye size={12} /> {preview ? "Tahrirlash" : "Ko'rish"}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                style={{ background: "rgba(255,80,80,0.1)", color: "#ff6b6b" }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Form body */}
        <div className="flex flex-col gap-5 px-4 sm:px-7 py-6">

          {/* Banner upload */}
          <div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#4d5e7a" }}
            >
              <span style={{ color: "#4f6ef7" }}><Upload size={13} /></span>
              Banner rasm
            </div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={dropBanner}
              onClick={() => fileRef.current?.click()}
              className="relative mt-2 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center transition-all"
              style={{
                height: banner ? 200 : 120,
                background: banner ? "transparent" : "rgba(79,110,247,0.04)",
                border: `2px dashed ${banner ? "transparent" : "rgba(140,165,255,0.35)"}`,
              }}
            >
              {banner ? (
                <>
                  <img src={banner.url} alt="banner" className="w-full h-full object-cover rounded-2xl" />
                  <div
                    className="absolute inset-0 flex items-center justify-center rounded-2xl opacity-0 hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(0,0,0,0.45)" }}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={20} color="#fff" />
                      <span className="text-white text-xs">Almashtirish</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setBanner(null); }}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.6)" }}
                  >
                    <X size={12} color="#fff" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "rgba(79,110,247,0.12)" }}
                  >
                    <Upload size={18} color="#4f6ef7" />
                  </div>
                  <span className="text-xs" style={{ color: "#5a6480" }}>Rasmni shu yerga qoying</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onBanner} />
          </div>

          {/* Category select */}
          <div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#4d5e7a" }}
            >
              <span style={{ color: "#4f6ef7" }}><Tag size={13} /></span>
              Kategoriya
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={catLoading}
              className="w-full mt-2 px-4 py-3 rounded-2xl text-sm outline-none transition-all appearance-none cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(160,180,255,0.28)",
                color: selectedCategory ? "#111" : "#5a6480",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(100,140,255,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(160,180,255,0.28)")}
            >
              <option value="" disabled>
                {catLoading ? "Yuklanmoqda…" : "Kategoriyani tanlang"}
              </option>
              {categories.map((cat) => (
                <option key={cat.id ?? cat.slug} value={cat.id ?? cat.slug}>
                  {cat.name ?? cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Title input */}
          <div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#4d5e7a" }}
            >
              <span style={{ color: "#4f6ef7" }}><Edit3 size={13} /></span>
              Sarlavha
            </div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Maqola sarlavhasini kiriting…"
              className="w-full mt-2 px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(160,180,255,0.28)",
                color: "#111",
                caretColor: "#4f6ef7",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(100,140,255,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(160,180,255,0.28)")}
            />
          </div>

          {/* Content editor */}
          <div>
            <div
              className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase mb-2"
              style={{ color: "#4d5e7a" }}
            >
              <span style={{ color: "#4f6ef7" }}><Edit3 size={13} /></span>
              Kontent
            </div>
            {!preview ? (
              <ReactQuill
                theme="snow"
                value={editorData}
                onChange={setEditorData}
                modules={modules}
                formats={formats}
              />
            ) : (
              <div
                className="ql-editor mt-2 rounded-2xl min-h-[220px]"
                style={{ border: "1px solid rgba(160,180,255,0.22)" }}
                dangerouslySetInnerHTML={{
                  __html: editorData || '<p style="color:#3d4d6a">Kontent hali yo\'q…</p>',
                }}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {onClose && (
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "#6b7a9a",
                  border: "1px solid rgba(160,180,255,0.22)",
                }}
              >
                Bekor qilish
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={load}
              className="px-6 py-2.5 flex items-center gap-2 bg-blue-500 text-gray-100 rounded-md text-sm font-semibold transition-all"
            >
              {load ? <><LoadingOutlined /> Jonatilmoqda...</> : "Nashrga jonatish"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
