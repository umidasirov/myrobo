import React from "react";
import BlogComponents from "../../components/blog";
import { Helmet } from 'react-helmet-async';

function Blog() {
  return (
    <>
      <Helmet>
        <title>Maqolalar - Myrobo</title>
        <meta name="description" content="Myrobo blogida dasturlash, texnologiya va ta'lim haqidagi maqolalarni o'qing. Foydali maslahatlar va yangiliklar." />
        <meta name="keywords" content="maqolalar, blog, dasturlash, texnologiya, ta'lim, Myrobo" />
        <meta property="og:title" content="Maqolalar - Myrobo" />
        <meta property="og:description" content="Myrobo blogida dasturlash, texnologiya va ta'lim haqidagi maqolalarni o'qing." />
        <meta property="og:type" content="website" />
      </Helmet>
      <section className="w-[90%] m-auto mt-[20px]">
        <div className="flex flex-col gap-[40px]">
          <h1 className="text-center text-[29px] font-bold">Maqolalar</h1>
        </div>

        <div>
          <BlogComponents />
        </div>
      </section>
    </>
  );
}

export default Blog;
