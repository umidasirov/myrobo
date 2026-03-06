import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { LoadingOutlined, SendOutlined, MessageOutlined } from "@ant-design/icons";
import notificationApi from "../../generic/notificition";

const modules = {
  toolbar: [
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    ["clean"],
  ],
};

const formats = ["bold", "italic", "underline", "list", "bullet", "link"];

const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-violet-100 text-violet-600",
  "bg-emerald-100 text-emerald-600",
  "bg-orange-100 text-orange-600",
  "bg-pink-100 text-pink-600",
  "bg-teal-100 text-teal-600",
];

const getColor = (name) => avatarColors[(name?.charCodeAt(0) || 0) % avatarColors.length];
const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", { year: "numeric", month: "short", day: "numeric" });
};

const maskUser = (user) => {
  if (!user) return "Foydalanuvchi";
  return user.slice(0, 4) + "***" + user.slice(-2);
};

function CommentSection({ slug }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const [success, setSuccess] = useState(false);

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

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const handleSubmit = async () => {
    const plainText = content.replace(/<[^>]+>/g, "").trim();
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
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        notify({type:"Yuborildi"});
        fetchComments();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  console.log(content);
  console.log(comments);
  
  

  return (
    <section className="w-full mt-16 mb-16">

      <style>{`
        .comment-quill .ql-toolbar.ql-snow {
          border-radius: 12px 12px 0 0;
          border-color: #e0e7ff;
          background: #f5f7ff;
          padding: 8px 14px;
        }
        .comment-quill .ql-container.ql-snow {
          border-radius: 0 0 12px 12px;
          border-color: #e0e7ff;
          font-size: 15px;
          font-family: inherit;
        }
        .comment-quill .ql-editor {
          min-height: 120px;
          color: #374151;
          padding: 14px 16px;
        }
        .comment-quill .ql-editor.ql-blank::before {
          color: #a5b4fc;
          font-style: normal;
        }
        .comment-quill .ql-snow .ql-stroke { stroke: #6366f1; }
        .comment-quill .ql-snow .ql-fill { fill: #6366f1; }
        .comment-quill .ql-snow .ql-picker { color: #6366f1; }
        .comment-quill:focus-within .ql-toolbar.ql-snow,
        .comment-quill:focus-within .ql-container.ql-snow {
          border-color: #818cf8;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }
        /* Comment render stillari */
        .comment-body a { color: #2563eb; text-decoration: underline; }
        .comment-body ul { list-style: disc; padding-left: 1.25rem; }
        .comment-body ol { list-style: decimal; padding-left: 1.25rem; }
        .comment-body strong { font-weight: 600; }
        .comment-body em { font-style: italic; }
      `}</style>

      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <div className="w-0.5 h-8 bg-gradient-to-r from-blue-600 to-indigo-400 rounded-full" />
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Izohlar
        </h2>
        {!loading && comments.length > 0 && (
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
            {comments.length}
          </span>
        )}
        {!token && (
          <span className="ml-auto text-xs text-yellow-700 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
            Izoh qoldirish uchun tizimga kiring
          </span>
        )}
      </div>

      {token && (
        <div className="bg-white rounded-2xl border border-blue-50 p-5 mb-8 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest">
            Fikringizni qoldiring
          </p>

          <div className="comment-quill mb-4">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Fikringizni yozing..."
            />
          </div>

          <div className="flex items-center justify-between mt-3">
            {success ? (
              <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                ✓ Izohingiz yuborildi!
              </span>
            ) : <span />}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                         disabled:bg-blue-300 text-white font-semibold px-5 py-2.5
                         rounded-xl text-sm transition-all duration-200 shadow-sm
                         shadow-blue-200 hover:shadow-blue-300 cursor-pointer"
            >
              {submitting ? (
                <><LoadingOutlined /> Yuborilmoqda...</>
              ) : (
                <><SendOutlined /> Yuborish</>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100" />
                <div className="flex flex-col gap-2">
                  <div className="h-3 w-28 bg-gray-200 rounded-full" />
                  <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
                </div>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded-full mb-2" />
              <div className="h-3 w-3/4 bg-gray-100 rounded-full" />
            </div>
          ))
        ) : comments.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
              <MessageOutlined className="text-blue-300 text-3xl" />
            </div>
            <p className="text-sm font-medium text-gray-500">Hali izoh qoldirilmagan</p>
            <p className="text-xs text-gray-400">Birinchi bo'lib fikr bildiring!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div
              key={comment.id || index}
              className="bg-white rounded-2xl border border-gray-100 p-5
                         hover:border-blue-100 hover:shadow-md hover:shadow-blue-50
                         transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                 font-bold text-[15px] flex-shrink-0 ${getColor(comment.user)}`}>
                  {getInitial(comment.user)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <p className="font-semibold text-gray-800 text-sm">
                      {maskUser(comment.user)}
                    </p>
                    <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 flex-shrink-0">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <div
                    className="comment-body text-gray-600 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: comment.text }}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default CommentSection;