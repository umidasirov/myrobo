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
        const res = await fetch("https://myrobo.uz/api/blog/categories/", {
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
        const res = await fetch("https://myrobo.uz/api/blog/blogs/", {
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
          fetch(`https://myrobo.uz/api/blog/blogs/?category=${slug}`, {
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
    <section className="w-full md:w-[90%] max-w-[1400px] mx-auto mt-6 md:mt-10 px-4 md:px-0 pb-16 md:pb-20">
     <div className="mb-6 md:mb-8 flex flex-col gap-4 md:gap-6">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
    <div className="flex items-center gap-2">
      <div className="h-0.5 md:h-[2px] flex-1 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" />
      <span className="whitespace-nowrap text-sm md:text-base font-medium text-gray-800">
        Barcha maqolalar
      </span>
    </div>

    <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-end">
      {!blogsLoading && (
        <span className="text-xs md:text-sm text-gray-400">
          {blogData.length} ta natija
        </span>
      )}

      <button
        onClick={() => handleBlogAdd()}
        className="flex items-center justify-center gap-2 rounded-md bg-blue-500 px-3 md:px-4 py-2 text-xs md:text-sm text-white transition hover:bg-blue-600 active:scale-95"
      >
        Maqola qo'shish
        <BiPencil />
      </button>
    </div>
  </div>

      {catsLoading ? (
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
          {[80, 100, 70, 90, 75].map((w, i) => (
            <div key={i} className="h-7 md:h-8 rounded-full bg-blue-50 animate-pulse" style={{ width: w }} />
          ))}
        </div>
      ) : categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8">

          <button
            onClick={clearAll}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium border-[1.5px] transition-all duration-200 whitespace-nowrap
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
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium border-[1.5px] transition-all duration-200 whitespace-nowrap
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
              className="px-2 md:px-3 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium text-red-400
                         border-[1.5px] border-red-100 bg-red-50 hover:bg-red-100
                         transition-all duration-200 flex items-center gap-1 whitespace-nowrap"
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
        <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogData.map((b) => (
            <BlogCard key={b.id} blog={b} onClick={() => goTo(b.slug)} />
          ))}
        </div>
      )}
      </div>
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
      className="group bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 cursor-pointer
                 flex flex-col hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-lg md:hover:shadow-xl hover:shadow-blue-100
                 hover:border-blue-100 transition-all duration-300"
    >
      <div className="relative h-40 md:h-48 overflow-hidden bg-blue-50">
        <img
          src={b.img}
          alt={b.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
          }}
        />
        {getCategoryTitle(b.category) && (
          <span className="absolute top-2 md:top-3 left-2 md:left-3 bg-blue-600/90 backdrop-blur-sm text-white
                           text-[9px] md:text-[10px] font-semibold uppercase tracking-widest px-2 md:px-2.5 py-0.5 md:py-1 rounded-full">
            {getCategoryTitle(b.category)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-3 md:p-4 flex-1">
        <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug line-clamp-2">
          {b.title}
        </h3>
        <p className="text-xs md:text-sm text-gray-400 line-clamp-2 flex-1 leading-relaxed">
          {truncate(stripHtml(b.description), 15)}</p>
        <div className="flex items-center gap-3 md:gap-4 pt-2 md:pt-3 mt-auto border-t border-gray-100">
          <MetaItem icon={<EyeOutlined />} label={b.views ?? 0} />
          <MetaItem icon={<CalendarOutlined />} label={formatDate(b.created_at)} />
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label }) {
  return (
    <div className="flex items-center gap-1 md:gap-1.5 min-w-0">
      <div className="w-4 md:w-5 h-4 md:h-5 rounded-full flex items-center justify-center text-blue-500 text-xs md:text-sm flex-shrink-0">
        {icon}
      </div>
      <span className="text-[10px] md:text-xs text-gray-400 truncate">{label}</span>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl md:rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
          <div className="h-40 md:h-48 bg-blue-50" />
          <div className="p-3 md:p-4 flex flex-col gap-2 md:gap-3">
            <div className="h-2 md:h-3 w-2/5 bg-blue-50 rounded-full" />
            <div className="h-3 md:h-4 w-full bg-gray-100 rounded-full" />
            <div className="h-3 md:h-4 w-3/4 bg-gray-100 rounded-full" />
            <div className="flex gap-2 md:gap-3 pt-2 border-t border-gray-100 mt-1">
              <div className="h-2 md:h-3 w-12 md:w-14 bg-blue-50 rounded-full" />
              <div className="h-2 md:h-3 w-16 md:w-20 bg-blue-50 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}