import { useEffect, useState, useCallback } from "react";
import { EyeOutlined, CalendarOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { BiPencil } from "react-icons/bi";
import notificationApi from "../../generic/notificition";

const truncate = (text = "", limit) => {
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
};

const formatDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("uz-UZ", { year: "numeric", month: "short", day: "numeric" });
};

const getCategoryTitle = (cat) => {
  if (!cat) return "";
  if (typeof cat === "object") return cat.title ?? "";
  return cat;
};

export default function BlogComponents() {
  const navigate = useNavigate();
  const [allBlogs, setAllBlogs] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [catsLoading, setCatsLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      setCatsLoading(true);
      try {
        const res = await fetch("https://api.myrobo.uz/blog/categories/", {
          headers: { "Content-Type": "application/json" },
        });
        setCategories(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setCatsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  const notif = notificationApi();
  const token = localStorage.getItem('token')
  const handleBlogAdd = () => {
    if (!token) {
      notif({ type: 'token' })
    }
    else {
      navigate('/blog-qosh')
    }

  }
  useEffect(() => {
    const fetchAll = async () => {
      setBlogsLoading(true);
      try {
        const res = await fetch("https://api.myrobo.uz/blog/blogs/", {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setAllBlogs(data);
        setBlogData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setBlogsLoading(false);
      }
    };
    fetchAll();
  }, []);
  const fetchBySelected = useCallback(async (slugSet) => {
    if (slugSet.size === 0) {
      setBlogData(allBlogs);
      return;
    }
    setBlogsLoading(true);
    try {
      const results = await Promise.all(
        [...slugSet].map((slug) =>
          fetch(`https://api.myrobo.uz/blog/blogs/?category=${slug}`, {
            headers: { "Content-Type": "application/json" },
          }).then((r) => r.json())
        )
      );
      const merged = Object.values(
        results.flat().reduce((acc, b) => ({ ...acc, [b.id]: b }), {})
      );
      setBlogData(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setBlogsLoading(false);
    }
  }, [allBlogs]);

  const handleSelect = (slug) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      fetchBySelected(next);
      return next;
    });
  };

  const clearAll = () => {
    setSelected(new Set());
    setBlogData(allBlogs);
  };

  const goTo = (slug) => navigate(`/blog/${slug}`, { state: { name: slug } });

  return (
    <section className="w-[90%] max-w-[1400px] mx-auto mt-10 pb-20">
      <div className="flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-[2px] bg-gradient-to-r from-blue-600 to-blue-400 rounded-full" />
          <div className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          </div>
          Barcha maqolalar
        </div>
        <div className="flex items-center gap-2">
          {!blogsLoading && (
            <span className="ml-auto text-xs text-gray-400">
              {blogData.length} ta natija
            </span>
          )}
          <button onClick={() => handleBlogAdd()} className="text-sm flex items-center p-2 rounded-md bg-blue-500 text-gray-100 hover:bg-blue-400">
            Maqola qo'shish <BiPencil />
          </button>
        </div>
      </div>

      {catsLoading ? (
        <div className="flex flex-wrap gap-2 mb-8">
          {[80, 100, 70, 90, 75].map((w, i) => (
            <div key={i} className="h-8 rounded-full bg-blue-50 animate-pulse" style={{ width: w }} />
          ))}
        </div>
      ) : categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">

          <button
            onClick={clearAll}
            className={`px-4 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] transition-all duration-200
              ${selected.size === 0
                ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                : "bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600"
              }`}
          >
            Barchasi
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelect(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium border-[1.5px] transition-all duration-200
                ${selected.has(cat.slug)
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                }`}
            >
              {cat.title}
            </button>
          ))}

          {selected.size > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-full text-[12px] font-medium text-red-400
                         border-[1.5px] border-red-100 bg-red-50 hover:bg-red-100
                         transition-all duration-200 flex items-center gap-1"
            >
              <span>×</span>
              <span>Tozalash {selected.size}</span>
            </button>
          )}
        </div>
      )}

      {blogsLoading ? (
        <SkeletonGrid />
      ) : blogData.length === 0 ? (
        <div className="flex flex-col items-center py-24 gap-3 text-gray-400">
          <span className="text-5xl">📭</span>
          <p className="text-[15px] font-semibold text-gray-700 mt-1">
            Bu kategoriyada hech narsa topilmadi
          </p>
          <button
            onClick={clearAll}
            className="text-sm text-blue-500 underline underline-offset-4 hover:text-blue-700 transition-colors"
          >
            Filtrni tozalash
          </button>
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogData.map((b) => (
            <BlogCard key={b.id} blog={b} onClick={() => goTo(b.slug)} />
          ))}
        </div>
      )}
    </section>
  );
}

function BlogCard({ blog: b, onClick }) {
  const stripHtml = (html = "") => {
    const div = document.createElement("div");
    div.innerHTML = html;

    div.querySelectorAll("img, video, iframe, figure").forEach((el) => el.remove());

    return (div.textContent || div.innerText || "").trim();
  };
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer
                 flex flex-col hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-100
                 hover:border-blue-100 hover:rounded-2xl transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-blue-50">
        <img
          src={b.img}
          alt={b.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {getCategoryTitle(b.category) && (
          <span className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white
                           text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full">
            {getCategoryTitle(b.category)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="text-[14.5px] font-bold text-gray-900 leading-snug line-clamp-2">
          {b.title}
        </h3>
        <p className="text-[12px] text-gray-400 line-clamp-2 flex-1 leading-relaxed">
          {truncate(stripHtml(b.description), 15)}</p>
        <div className="flex items-center gap-4 pt-3 mt-auto border-t border-gray-100">
          <MetaItem icon={<EyeOutlined />} label={b.views ?? 0} />
          <MetaItem icon={<CalendarOutlined />} label={formatDate(b.created_at)} />
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-5 h-5 rounded-full flex items-center justify-center text-blue-500 text-[14px] flex-shrink-0">
        {icon}
      </div>
      <span className="text-[11.5px] text-gray-400">{label}</span>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-48 bg-blue-50" />
          <div className="p-4 flex flex-col gap-3">
            <div className="h-3 w-2/5 bg-blue-50 rounded-full" />
            <div className="h-4 w-full bg-gray-100 rounded-full" />
            <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
            <div className="flex gap-3 pt-2 border-t border-gray-100 mt-1">
              <div className="h-3 w-14 bg-blue-50 rounded-full" />
              <div className="h-3 w-20 bg-blue-50 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}