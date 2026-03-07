import { useEffect, useState, useRef } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import notificationApi from "../../generic/notificition";

const avatarColors = [
  "bg-blue-800",
  "bg-purple-800",
  "bg-green-800",
  "bg-pink-700",
  "bg-teal-700",
  "bg-orange-700",
  "bg-indigo-800",
  "bg-blue-900",
];

const getAvatarColor = (name) =>
  avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];

const getInitial = (name) =>
  name ? name.charAt(0).toUpperCase() : "?";

const formatDate = (iso) => {
  if (!iso) return "";
  const now = new Date();
  const d = new Date(iso);
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return `${diff} soniya oldin`;
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)} kun oldin`;
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} oy oldin`;
  return `${Math.floor(diff / 31536000)} yil oldin`;
};


function CommentSection({ slug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [focused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef(null);
  const user = localStorage.getItem('username')
  const token = localStorage.getItem("token");
  const notify = notificationApi();

  const fetchComments = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.myrobo.uz/blog/blogs/${slug}/comments/`, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setComments(Array.isArray(data) ? data : (data.results ?? []));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComments(); }, [slug]);

  const handleCancel = () => {
    setContent("");
    setFocused(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.blur();
    }
  };

  const handleSubmit = async () => {
    const plainText = content.trim();
    if (!plainText || !token) return;
    setSubmitting(true);
    try {
      const res = await fetch(`https://api.myrobo.uz/blog/blogs/${slug}/comments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: content }),
      });
      if (res.ok) {
        setContent("");
        setFocused(false);
        if (textareaRef.current) textareaRef.current.style.height = "auto";
        setSuccess(true);
        setTimeout(() => setSuccess(false), 4000);
        notify({ type: "Yuborildi" });
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full py-6 pb-12 font-sans text-[#0f0f0f]">

      <div className="flex items-center gap-6 mb-6">
        {!loading && (
          <span className="text-base font-medium text-[#0f0f0f]">
            {comments.length} ta izoh
          </span>
        )}
      </div>

      {success && (
        <div className="inline-flex items-center gap-2 bg-[#323232] text-white text-[13px] px-4 py-2.5 rounded mb-5">
          ✓ Izohingiz joylashtirildi
        </div>
      )}

      {token ? (
        <div className="flex gap-4 items-start mb-10">
          <div className="w-10 h-10 rounded-full bg-[#606060] flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0 select-none">
            {user.length>0 ? user[0] : 'u'}
          </div>

          <div className="flex-1 min-w-0">
            <div className={`border-b transition-all duration-150 ${focused ? "border-b-2 border-gray-300" : "border-b border-gray-300"}`}>
              <textarea
                ref={textareaRef}
                className="w-full border-none outline-none bg-transparent text-sm text-[#0f0f0f] placeholder-[#717171] py-1 pb-2 resize-none leading-5 overflow-hidden box-border"
                value={content}
                placeholder="Izoh qo'shish..."
                rows={1}
                onFocus={() => setFocused(true)}
                onChange={(e) => {
                  setContent(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
            </div>

            {focused && (
              <div className="flex items-center justify-end gap-2 mt-3">
                <button
                  onClick={handleCancel}
                  className="text-sm font-medium text-[#0f0f0f] px-4 py-2 rounded-full hover:bg-[#f2f2f2] transition-colors cursor-pointer border-none bg-transparent"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !content.trim()}
                  className="text-sm font-medium px-4 py-2 rounded transition-colors cursor-pointer border-none
                    bg-[#065fd4] text-white hover:bg-[#0b57c0]
                    disabled:bg-[#f2f2f2] disabled:text-[#aaaaaa] disabled:cursor-default"
                >
                  {submitting
                    ? <span className="flex items-center gap-1.5"><LoadingOutlined />Yuborilmoqda</span>
                    : "Izoh qoldirish"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex gap-4 items-center mb-8 pb-3 border-b border-[#e5e5e5]">
          <div className="w-10 h-10 rounded-full bg-[#e5e5e5] flex-shrink-0" />
          <div className="text-sm text-[#717171] border-b border-[#d3d3d3] flex-1 pb-2">
            Izoh qoldirish uchun tizimga kiring
          </div>
        </div>
      )}

      <div className="flex flex-col">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 py-4">
              <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-pulse" />
              <div className="flex-1 flex flex-col gap-2 pt-1">
                <div className="h-3 w-[28%] rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-pulse" />
                <div className="h-3 w-[88%] rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-pulse" />
                <div className="h-3 w-[60%] rounded bg-gradient-to-r from-[#f0f0f0] via-[#e0e0e0] to-[#f0f0f0] bg-[length:200%_100%] animate-pulse" />
              </div>
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-5xl mb-3 opacity-35">💬</div>
            <div className="text-sm text-[#717171]">
              Hali izoh qoldirilmagan. Birinchi bo'ling!
            </div>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id || index} className="flex gap-4 py-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[15px] flex-shrink-0 select-none ${getAvatarColor(comment.user)}`}>
                {getInitial(comment.user)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <span className="text-[13px] font-medium text-[#0f0f0f]">
                    {comment.user}
                  </span>
                  <span className="text-xs text-[#717171]">
                    {formatDate(comment.created_at)}
                  </span>
                </div>
                <div
                  className="text-sm text-[#0f0f0f] leading-5 break-words [&_p]:mb-1 [&_p:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default CommentSection;