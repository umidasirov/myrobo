import { CalendarOutlined, EyeOutlined } from "@ant-design/icons";
import {
  FaTelegramPlane,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
} from "react-icons/fa";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CommentSection from "../comments";
import { Helmet } from 'react-helmet-async';

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

function BlogComponentsId() {
  const [loading, setLoading] = useState(false);
  const [blog, setBlog] = useState(null);

  const { slug } = useParams();
  const location = useLocation();
  const name = location?.state?.name ?? slug;
  
  useEffect(() => {
    if (!name) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://myrobo.uz/api/blog/blogs/${name}/`, {
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        setBlog(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [name]);

  return (
    <>
      <Helmet>
        <title>{blog?.title ? `${blog.title} - MyRobo` : 'Maqola - MyRobo'}</title>
        <meta name="description" content={blog?.description || "MyRobo blogidagi maqolani o'qing."} />
        <meta name="keywords" content={`maqola, ${blog?.category ? getCategoryTitle(blog.category) : ''}, MyRobo`} />
        <meta property="og:title" content={blog?.title || 'Maqola - MyRobo'} />
        <meta property="og:description" content={blog?.description || "MyRobo blogidagi maqolani o'qing."} />
        <meta property="og:image" content={blog?.img} />
        <meta property="og:type" content="article" />
      </Helmet>
      <section className="w-[95%] md:w-[70%] m-auto mt-4 md:mt-[40px]">
      <div className="w-full flex flex-col gap-[40px] max-[500px]:gap-[25px]">

        <div className="w-full flex flex-col gap-[20px]">
          {loading ? (
            <div className="w-full h-[500px] bg-gray-300 animate-pulse rounded-2xl" />
          ) : (
            <img
              className="w-full h-[250px] sm:h-[350px] md:h-[450px] xl:h-[550px] object-cover rounded-2xl"
              src={blog?.img}
              alt={blog?.title}
            />
          )}

          <div className="gap-[40px] hidden max-[700px]:flex max-[524px]:justify-end">
            {loading ? (
              <>
                <MetaSkeleton />
                <MetaSkeleton />
              </>
            ) : (
              <>
                <MetaItem icon={<EyeOutlined />} label={blog?.views} />
                <MetaItem icon={<CalendarOutlined />} label={formatDate(blog?.created_at)} />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-[40px] max-[500px]:gap-[20px]">

          <div className="flex items-end justify-between gap-[40px]">
            {loading ? (
              <div className="h-8 w-[250px] bg-gray-300 rounded-md animate-pulse" />
            ) : (
              <div className="flex flex-col gap-1">
                {getCategoryTitle(blog?.category) && (
                  <span className="text-[12px] font-semibold uppercase tracking-wider text-[#525254]">
                    {getCategoryTitle(blog?.category)}
                  </span>
                )}
                <h1 className="text-[29px] font-bold max-[768px]:text-[22px] max-[590px]:text-[17px]">
                  {blog?.title}
                </h1>
              </div>
            )}

            <div className="flex gap-[40px] max-[700px]:hidden">
              {loading ? (
                <>
                  <MetaSkeleton />
                  <MetaSkeleton />
                </>
              ) : (
                <>
                  <MetaItem icon={<EyeOutlined />} label={blog?.views} />
                  <MetaItem icon={<CalendarOutlined />} label={formatDate(blog?.created_at)} />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-[30px]">
            {loading ? (
              <div className="h-6 w-[90%] bg-gray-300 rounded-md animate-pulse" />
            ) : (
              <div
                className="text-[17px] blog-content text-gray-600 max-[590px]:text-[15px] max-[490px]:text-[13px] prose max-w-none"
                dangerouslySetInnerHTML={{ __html: blog?.description }}
              />
            )}

            <div className="flex items-center gap-[20px] max-[524px]:justify-center">
              {loading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-[45px] h-[45px] bg-gray-300 rounded-full animate-pulse" />
                  ))}
                </>
              ) : (
                <>
                  <SocialBtn icon={<FaTelegramPlane />} />
                  <SocialBtn icon={<FaInstagram />} />
                  <SocialBtn icon={<FaYoutube />} />
                  <SocialBtn icon={<FaFacebookF />} />
                </>
              )}
            </div>
          </div>
        </div>

        <CommentSection slug={name} />
      </div>
    </section>
    </>
  );
}

function MetaItem({ icon, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-[25px] h-[25px] bg-[#525254] rounded-full flex items-center justify-center text-[#fff]">
        {icon}
      </div>
      <p className="text-[17px] text-gray-500">{label}</p>
    </div>
  );
}

function MetaSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="w-[25px] h-[25px] bg-gray-300 rounded-full" />
      <div className="h-4 w-16 bg-gray-300 rounded-md" />
    </div>
  );
}

function SocialBtn({ icon }) {
  return (
    <div className="w-[45px] cursor-pointer h-[45px] p-3 rounded-full shadow-md shadow-blue-300 flex items-center justify-center text-[22px] hover:bg-blue-600 hover:text-[#FFF] transition-all duration-300">
      {icon}
    </div>
  );
}

export default BlogComponentsId;