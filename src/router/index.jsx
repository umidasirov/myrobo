import { createBrowserRouter, Navigate } from "react-router-dom";
import Home from "../pages/home";
import Kurslar from "../pages/kurslar";
import Blog from "../pages/blog";
import Layout from "../components/layout";
import BlogComponentsId from "../components/blog2";
import KirishComponentsID from "../components/kirish2";
import LoginPage from "../components/login";
import FrontendProfile from "../components/frontendcourse";
import Team2 from "../components/team2";
import Check from "../components/check";
import Profilim from "../components/profilim";
import MeningKurslarim from "../components/meningkurslarim";
import Sertificatlarim from "../components/sertificatlarim";
import NotFound from "../components/not-found";
import BlogEditor from "../components/BlogEditor";

const root = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "kurslar",
        element: <Kurslar />,
      },
      {
        path: "blog",
        element: <Blog />,
      },
      {
        path: "blog/:slug",
        element: <BlogComponentsId />,
      },

      {
        path: "team2",
        element: <Team2 />,
      },
      {
        path: "kurslar/:slug",
        element: <KirishComponentsID />,
      },
      { path: "frontend", 
        element: <Navigate to="/" replace /> 
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "kurslar/:slug/:courseId",
        element: <FrontendProfile />,
      },
      {
        path: "check",
        element: <Check />,
      },
      {
        path: "profilim",
        element: <Profilim />,
      },
      {
        path: "my-courses",
        element: <MeningKurslarim />,
      },
      {
        path: "sertificatlarim",
        element: <Sertificatlarim />,
      },
      {
        path:"blog-qosh",
        element:<BlogEditor/>
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default root;
