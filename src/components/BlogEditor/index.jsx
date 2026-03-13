import { useState, useRef, useCallback, useEffect } from "react";
import { X, Upload, Link, Type, Image, Bold, Italic, List, Quote, Code, Eye, Edit3, AlignCenter, AlignLeft, AlignRight, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {notification} from 'antd'
import { LuLoader } from "react-icons/lu";
import {LoadingOutlined} from "@ant-design/icons"
export default function BlogEditor({ onClose }) {
  const [title, setTitle] = useState("");
  const [urlVal, setUrlVal] = useState("");
  const [tags, setTags] = useState([]);
  const [banner, setBanner] = useState(null);
  const [preview, setPreview] = useState(false);
  const [showUrl, setShowUrl] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeAlign, setActiveAlign] = useState("left");
  const [load,setLoad] = useState(false)
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const imgInputRef = useRef(null);
  const urlInputRef = useRef(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate("/blog");
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (showUrl && !e.target.closest(".url-popup")) setShowUrl(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showUrl]);

  useEffect(() => {
    
    const editor = editorRef.current;
    if (!editor) return;
    const handleClick = (e) => {
      setSelectedImg(e.target.tagName === "IMG" ? e.target : null);
    };
    editor.addEventListener("click", handleClick);
    return () => editor.removeEventListener("click", handleClick);
  }, []);

  const createLink = () => {
    if (!urlVal) return;
    editorRef.current?.focus();
    document.execCommand("createLink", false, urlVal);
    setUrlVal("");
    setShowUrl(false);
  };

  const insertImage = (src) => {
    editorRef.current?.focus();
    const wrapper = `<div style="text-align:center;margin:12px 0;"><img src="${src}" style="max-width:100%;border-radius:10px;display:inline-block;" /></div>`;
    document.execCommand("insertHTML", false, wrapper);
  };

  const onBanner = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBanner({ url: URL.createObjectURL(file), file });
  };

  const onInsertImg = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    insertImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const dropBanner = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith("image/")) setBanner({ url: URL.createObjectURL(file), file });
  }, []);

  const exec = (cmd, val) => {
    if (cmd === "link") {
      setShowUrl((v) => !v);
      setTimeout(() => urlInputRef.current?.focus(), 50);
      return;
    }
    if (cmd === "insertImage") {
      imgInputRef.current?.click();
      return;
    }
    editorRef.current?.focus();
    document.execCommand(cmd, false, val ?? null);
  };

  const alignContent = (align) => {
    if (selectedImg) {
      const wrapper = selectedImg.closest("div[style]");
      if (wrapper) wrapper.style.textAlign = align;
      setSelectedImg(null);
    } else {
      editorRef.current?.focus();
      const cmdMap = { left: "justifyLeft", center: "justifyCenter", right: "justifyRight" };
      document.execCommand(cmdMap[align], false, null);
    }
    setActiveAlign(align);
  };

  const TOOLBAR_LEFT = [
    { cmd: "bold", icon: <Bold size={14} />, title: "Bold" },
    { cmd: "italic", icon: <Italic size={14} />, title: "Italic" },
    { cmd: "insertUnorderedList", icon: <List size={14} />, title: "List" },
    { cmd: "formatBlock", val: "blockquote", icon: <Quote size={14} />, title: "Quote" },
    { cmd: "formatBlock", val: "pre", icon: <Code size={14} />, title: "Code" },
    { cmd: "formatBlock", val: "h2", icon: <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1 }}>H2</span>, title: "Heading 2" },
    { cmd: "formatBlock", val: "h3", icon: <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1 }}>H3</span>, title: "Heading 3" },
    { cmd: "insertHorizontalRule", icon: <Minus size={14} />, title: "Divider" },
    { cmd: "insertImage", icon: <Image size={14} />, title: "Insert Image" },
    { cmd: "link", icon: <Link size={14} />, title: "Insert Link" },
  ];

  const ALIGN_BTNS = [
    { align: "left", icon: <AlignLeft size={14} />, title: "Chapga" },
    { align: "center", icon: <AlignCenter size={14} />, title: "Markazga" },
    { align: "right", icon: <AlignRight size={14} />, title: "O'ngga" },
  ];

  const htmlContent = editorRef.current?.innerHTML ?? "";

  const handleSubmit = async () => {
    const description = editorRef.current?.innerHTML ?? "";
    if (!title.trim()) { setError("Title kiritish majburiy"); return notification.error({ message: error,}); }
    if (!description.trim()) { setError("Description kiritish majburiy"); return notification.error({ message: error,}); }
    if (!banner?.file) { setError("Banner rasm majburiy"); return notification.error({ message: error,}); }
    setError("");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("img", banner.file);
    setLoad(true)
    try {
      
      const res = await fetch("https://api.myrobo.uz/blog/blog-create/", { 
        method: "POST", 
        body: formData,
        headers: {
          // "Content-Type": "application/json",  
          "Authorization": `Bearer ${token}`,  
        }, 
      });
      if (!res.ok) throw new Error("Server xatolik qaytardi");
      const data = await res.json();
      console.log(data);
      notification.success({
                message: "Muvofaqiyali jonatildi",
              });
    } catch (err) {
      setError("Post yuborishda xatolik");
      console.error(err);
      notification.error({
                message: "Post yuborishda xatolik",
              });
    }
    finally{
      setLoad(false)  
    }
  };

  const toolbarBtnStyle = (active) => ({
    color: active ? "#7fa4ff" : "#5a6a8a",
    background: active ? "rgba(79,110,247,0.18)" : "transparent",
    border: active ? "1px solid rgba(79,110,247,0.4)" : "1px solid transparent",
  });

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative rounded-3xl flex flex-col w-full max-w-3xl gap-2">

        <div className="flex items-center justify-between px-7 p-4 pt-6 pb-4 border-b" style={{ borderColor: "rgba(160,180,255,0.25)" }}>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4f6ef7,#7c3aed)" }}>
              <Edit3 size={13} color="#fff" />
            </div>
            <span className="font-semibold text-sm tracking-wide" style={{ color: "#c5cfe8" }}>Yangi maqola</span>
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
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl transition-all" style={{ background: "rgba(255,80,80,0.1)", color: "#ff6b6b" }}>
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5 px-4 sm:px-7 py-6">

          {/* Banner */}
          <div>
            <Label icon={<Image size={13} />}>Banner rasm</Label>
            <div
              onDragOver={(e) => e.preventDefault()} onDrop={dropBanner}
              onClick={() => fileRef.current?.click()}
              className="relative mt-2 rounded-2xl overflow-hidden cursor-pointer flex items-center justify-center transition-all"
              style={{ height: banner ? 200 : 120, background: banner ? "transparent" : "rgba(79,110,247,0.04)", border: `2px dashed ${banner ? "transparent" : "rgba(140,165,255,0.35)"}` }}
            >
              {banner ? (
                <>
                  <img src={banner.url} alt="banner" className="w-full h-full object-cover rounded-2xl" />
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl transition-all" style={{ background: "rgba(0,0,0,0)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.45)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0)")}>
                    <div className="flex flex-col items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
                      <Upload size={20} color="#fff" />
                      <span className="text-white text-xs">Almashtirish</span>
                    </div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setBanner(null); }} className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
                    <X size={12} color="#fff" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "rgba(79,110,247,0.12)" }}>
                    <Upload size={18} color="#4f6ef7" />
                  </div>
                  <span className="text-xs" style={{ color: "#5a6480" }}>Rasm sudrab tashlang yoki bosing</span>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onBanner} />
          </div>

          <div>
            <Label icon={<Type size={13} />}>Sarlavha</Label>
            <input
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Maqola sarlavhasini kiriting…"
              className="w-full mt-2 px-4 py-3 rounded-2xl text-sm outline-none transition-all"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(160,180,255,0.28)", color: "#111", caretColor: "#4f6ef7" }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(100,140,255,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(160,180,255,0.28)")}
            />
          </div>

          <div>
            <Label icon={<Edit3 size={13} />}>Kontent</Label>

            {!preview ? (
              <div className="mt-2 rounded-2xl overflow-visible" style={{ border: "1px solid rgba(160,180,255,0.28)" }}>

                <div className="flex items-center gap-1 px-3 py-2 border-b flex-wrap" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(160,180,255,0.2)" }}>

                  {TOOLBAR_LEFT.map((t, i) => (
                    <button
                      key={i} title={t.title}
                      onMouseDown={(e) => { e.preventDefault(); exec(t.cmd, t.val); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ color: "#5a6a8a" }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(79,110,247,0.15)"; e.currentTarget.style.color = "#7fa4ff"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#5a6a8a"; }}
                    >
                      {t.icon}
                    </button>
                  ))}

                  <div style={{ width: 1, height: 18, background: "rgba(160,180,255,0.2)", margin: "0 4px", flexShrink: 0 }} />

                  {ALIGN_BTNS.map(({ align, icon, title }) => (
                    <button
                      key={align} title={title}
                      onMouseDown={(e) => { e.preventDefault(); alignContent(align); }}
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-all"
                      style={toolbarBtnStyle(activeAlign === align)}
                      onMouseEnter={(e) => {
                        if (activeAlign !== align) {
                          e.currentTarget.style.background = "rgba(79,110,247,0.15)";
                          e.currentTarget.style.color = "#7fa4ff";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (activeAlign !== align) {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#5a6a8a";
                        }
                      }}
                    >
                      {icon}
                    </button>
                  ))}

                  {showUrl && (
                    <div className="url-popup flex items-center gap-1.5 ml-1 px-2 py-1 rounded-xl" style={{ background: "rgba(20,24,40,0.98)", border: "1px solid rgba(79,110,247,0.5)" }}>
                      <input
                        ref={urlInputRef} type="url" value={urlVal}
                        onChange={(e) => setUrlVal(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") createLink(); if (e.key === "Escape") setShowUrl(false); }}
                        placeholder="https://..."
                        className="outline-none text-xs px-1 py-0.5 rounded"
                        style={{ background: "transparent", color: "#111", width: 160, caretColor: "#4f6ef7" }}
                      />
                      <button onClick={createLink} className="text-xs px-2 py-0.5 rounded-lg font-semibold" style={{ background: "#4f6ef7", color: "#fff" }}>OK</button>
                      <button onClick={() => setShowUrl(false)} style={{ color: "#5a6a8a" }}><X size={12} /></button>
                    </div>
                  )}
                </div>

                <div
                  ref={editorRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={(e) => setContent(e.currentTarget.innerHTML)}
                  data-placeholder="Maqola matnini yozing…"
                  className="min-h-[220px] px-5 py-4 text-sm outline-none leading-relaxed"
                  style={{ color: "#111", caretColor: "#4f6ef7", background: "rgba(255,255,255,0.015)" }}
                />
              </div>
            ) : (
              <div
                className="mt-2 rounded-2xl px-5 py-4 min-h-[220px] prose prose-invert prose-sm max-w-none text-sm leading-relaxed"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(160,180,255,0.22)", color: "#c0cbdf" }}
                dangerouslySetInnerHTML={{ __html: htmlContent || '<p style="color:#3d4d6a">Kontent hali yo\'q…</p>' }}
              />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            {onClose && (
              <button onClick={onClose} className="px-5 py-2.5 rounded-2xl text-sm font-medium transition-all"
                style={{ background: "rgba(255,255,255,0.04)", color: "#6b7a9a", border: "1px solid rgba(160,180,255,0.22)" }}>
                Bekor qilish
              </button>
            )}
            <button onClick={handleSubmit} className="px-6 py-2.5 flex items-center bg-blue-500 text-gray-100 rounded-md text-sm font-semibold transition-all">
              {load?<div className="flex items-center justify-center"><LoadingOutlined/> Jonatilmoqda...</div>:'Nashrga jonatish'}
            </button>
          </div>
        </div>
      </div>

      <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={onInsertImg} />

      <style>{`
        [contenteditable]:empty:before { content: attr(data-placeholder); color: #2e3a50; pointer-events: none; }
        [contenteditable] blockquote { border-left: 3px solid #4f6ef7; padding-left: 12px; margin: 8px 0; color: #7fa4ff; }
        [contenteditable] pre { background: rgba(0,0,0,0.08); padding: 10px 14px; border-radius: 10px; font-family: monospace; font-size: 12px; color: #0e4e6e; }
        [contenteditable] a { color: #4f6ef7; text-decoration: underline; font-weight: 500; }
        [contenteditable] h2 { font-size: 1.3em; font-weight: 700; margin: 10px 0 4px; color: #1a1a2e; }
        [contenteditable] h3 { font-size: 1.1em; font-weight: 600; margin: 8px 0 4px; color: #1a1a2e; }
        [contenteditable] hr { border: none; border-top: 1px solid rgba(160,180,255,0.3); margin: 14px 0; }
        [contenteditable] img { cursor: pointer; transition: outline 0.15s; text-align: center; }
        [contenteditable] img:hover { outline: 2px solid rgba(79,110,247,0.5); border-radius: 10px; }
        .url-popup input::placeholder { color: #8892aa; }
      `}</style>
    </div>
  );
}

function Label({ icon, children }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase" style={{ color: "#4d5e7a" }}>
      <span style={{ color: "#4f6ef7" }}>{icon}</span>
      {children}
    </div>
  );
}
