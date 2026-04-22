import React, { useEffect } from "react";
import Navbar from "../navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../footer";
import { Helmet } from 'react-helmet-async';
import ScrollToTop from "../../top";
import { useData } from "../../datacontect";
function Layout() {
  const location = useLocation();
    useEffect(() => {

  },[])
  const hideLayout = location.pathname === '/subscription' || location.pathname === '/login';
  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="MyRobo" />
        <meta property="og:site_name" content="MyRobo" />
      </Helmet>
      {!hideLayout && <Navbar />}
      <main>
        <ScrollToTop/>
        <Outlet />
      </main>
      {!hideLayout && <Footer />}
    </>
  );
}

export default Layout;
