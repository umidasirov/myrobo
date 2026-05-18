import { useEffect } from "react";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { setGlobalLogoutCallback, apiFetch } from "../utils/api";
import { notification } from "antd";

const DataContext = createContext();

const BASE_URL = "https://myrobo.adxamov.uz/";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);           // courses list (results massivi)
  const [blogData, setBlogData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoad] = useState(false);
  const [user, setUser] = useState(null);
  const [mentorData, setMentorData] = useState(null);

  // ===== DARK MODE =====
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  // =====================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    localStorage.removeItem("phone");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("refresh");
    localStorage.removeItem("locate");
    setUser(null);
    notification.success({
      message: "Siz muvaffaqiyatli tarzda tizimdan chiqdingiz",
    });
  };

  const handleLogoutAnother = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    localStorage.removeItem("phone");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("refresh");
    localStorage.removeItem("locate");
    setUser(null);
    notification.error({
      message: "Sessiyangiz tugagan, iltimos qayta kirish qiling",
    });
    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }, 2000);
  };

  setGlobalLogoutCallback(handleLogoutAnother);

  useEffect(() => {
    const resInterceptor = api.interceptors.response.use(
      (response) => {
        if (
          response?.data?.code === "token_not_valid" ||
          response?.data?.detail?.includes("Sessiya bekor qilingan")
        ) {
          handleLogout();
        }
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        const status = error.response?.status;
        const detail = error.response?.data?.detail;
        const code = error.response?.data?.code;

        const isTokenInvalid =
          code === "token_not_valid" ||
          detail?.includes("Sessiya bekor qilingan");

        const hasToken = localStorage.getItem("token");

        if (!hasToken) {
          return Promise.reject(error);
        }

        if ((status === 401 || isTokenInvalid) && !originalRequest._retry) {
          originalRequest._retry = true;

          const refresh = localStorage.getItem("refresh");
          if (!refresh) {
            handleLogoutAnother();
            return Promise.reject(error);
          }

          try {
            const res = await axios.post(
              `${BASE_URL}user/auth/token/refresh/`,
              { refresh }
            );
            const newAccess = res.data.access;
            localStorage.setItem("token", newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          } catch {
            handleLogoutAnother();
            return Promise.reject(error);
          }
        }

        if (status === 401 || isTokenInvalid) {
          handleLogoutAnother();
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // ── O'qituvchilar ──────────────────────────────────────────────────────────
  const fetchTeam = async () => {
    setLoad(true);
    try {
      const response = await fetch(`${BASE_URL}teachers/teachers/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      setTeacherData(Array.isArray(result) ? result : result.results ?? []);
    } catch (err) {
      console.error("fetchTeam xatosi:", err);
    } finally {
      setLoad(false);
    }
  };

  // ── Kurslar ro'yxati ───────────────────────────────────────────────────────
  // GET /courses/courses/
  // Javob: { count, next, previous, results: [...] }
  const fetchCourse = async () => {
    setLoad(true);
    try {
      const response = await api.get("/courses/courses/");
      if (
        response.status === 401 ||
        response.data?.code === "token_not_valid"
      ) {
        handleLogout();
        return;
      }
      setData(response.data.results ?? []);
    } catch (err) {
      console.error("fetchCourse xatosi:", err);
    } finally {
      setLoad(false);
    }
  };
  

  // ── Kurs detali ────────────────────────────────────────────────────────────
  // GET /courses/courses/{slug}/
  const fetchCourseDetail = async (slug) => {
    try {
      const response = await api.get(`/courses/courses/${slug}/`);
      if (
        response.status === 401 ||
        response.data?.code === "token_not_valid"
      ) {
        handleLogout();
        return null;
      }
      return response.data;
    } catch (err) {
      console.error("fetchCourseDetail xatosi:", err);
      return null;
    }
  };
  
  // ── Kurs sotib olish ───────────────────────────────────────────────────────
  // POST /courses/courses/{slug}/purchase/
  // Body: { purchase_type: "course", plan_id: "..." }
  const toPament = async (slug, planId, purchaseType = "course") => {
    try {
      const response = await api.post(
        `/courses/courses/${slug}/purchase/`,
        { purchase_type: purchaseType, plan_id: planId }
      );
      if (
        response.status === 401 ||
        response.data?.code === "token_not_valid"
      ) {
        handleLogout();
        return null;
      }
      notification.error({message:'nma'})
      console.log(response.data);
      
      return response.data;
    } catch (err) {
      console.error("toPament xatosi:", err);
      return null;
    }
  };

  // ── Mening obunalarim ──────────────────────────────────────────────────────
  // GET /courses/my/subscriptions/
  const fetchMySubscriptions = async () => {
    try {
      const response = await api.get("/courses/my/subscriptions/");
      return response.data.results ?? response.data ?? [];
    } catch (err) {
      console.error("fetchMySubscriptions xatosi:", err);
      return [];
    }
  };

  // ── Mening xaridlarim ──────────────────────────────────────────────────────
  // GET /courses/my/purchases/
  const fetchMyPurchases = async () => {
    try {
      const response = await api.get("/courses/my/purchases/");
      return response.data.results ?? response.data ?? [];
    } catch (err) {
      console.error("fetchMyPurchases xatosi:", err);
      return [];
    }
  };

  // ── Darsni tugallash ───────────────────────────────────────────────────────
  // POST /courses/lessons/{lesson-slug}/complete/
  const completeLesson = async (lessonSlug) => {
    try {
      const response = await api.post(
        `/courses/lessons/${lessonSlug}/complete/`
      );
      return response.data;
    } catch (err) {
      console.error("completeLesson xatosi:", err);
      return null;
    }
  };

  // ── Foydalanuvchi profili ──────────────────────────────────────────────────
  // GET /user/auth/me/
  const fetchUserData = async () => {
    try {
      setLoad(true);
      const response = await api.get("/user/profile/");
      if (
        response.status === 401 ||
        response.data?.code === "token_not_valid"
      ) {
        handleLogout();
        return;
      }
      setUser(response.data);
    } catch (error) {
      console.error("fetchUserData xatosi:", error);
    } finally {
      setLoad(false);
    }
  };
  const fetchTeachers = async (slug) => {
    setLoad(true);

    try {
      const response = await fetch(`${BASE_URL}teachers/teachers/${slug}/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();

      console.log("mentor detail:", result);

      setMentorData(result);
    } catch (err) {
      console.error("fetchTeachers xatosi:", err);
      setMentorData(null);
    } finally {
      setLoad(false);
    }
  };
  const updateUser = async (fields) => {
    try {
      const response = await api.patch("/user/auth/me/", fields);
      setUser(response.data);
      return { ok: true };
    } catch (error) {
      return { ok: false };
    }
  };

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        blogData,
        setBlogData,
        teacherData,
        setTeacherData,
        fetchCourse,
        fetchCourseDetail,   // ✅ yangi
        toPament,
        fetchMySubscriptions, // ✅ yangi
        fetchMyPurchases,     // ✅ yangi
        completeLesson,       // ✅ yangi
        user,
        setUser,
        fetchUserData,
        updateUser,
        handleLogout,
        loading,
        fetchTeam,
        isDark,
        toggleTheme,
        fetchTeachers,
        mentorData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);