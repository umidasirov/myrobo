import { useEffect } from "react";
import axios from "axios";
import { createContext, useContext, useState } from "react";
import { setGlobalLogoutCallback, apiFetch } from "../utils/api";

const DataContext = createContext();

const api = axios.create({
  baseURL: "https://myrobo.uz/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  const [loading, setLoad] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("balance");
    localStorage.removeItem("phone");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("refresh");
    localStorage.removeItem("locate");
    setUser(null);
    location.reload();
  };

  // ✅ Global logout callback'ni set qil - barcha fetch'lar uchun
  setGlobalLogoutCallback(handleLogout);


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

      // ❗ TOKEN YO‘Q bo‘lsa logout qilma
      if (!hasToken) {
        return Promise.reject(error);
      }

      if ((status === 401 || isTokenInvalid) && !originalRequest._retry) {
        originalRequest._retry = true;

        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
          handleLogout();
          return Promise.reject(error);
        }

        try {
          const res = await axios.post(
            "https://myrobo.uz/api/user/auth/token/refresh/",
            { refresh }
          );

          const newAccess = res.data.access;
          localStorage.setItem("token", newAccess);

          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch {
          handleLogout();
          return Promise.reject(error);
        }
      }

      if (status === 401 || isTokenInvalid) {
        handleLogout();
      }

      return Promise.reject(error);
    }
  );

  return () => {
    api.interceptors.response.eject(resInterceptor);
  };
}, []);

  const fetchTeam = async () => {
    setLoad(true);
    try {
      const response = await fetch("https://myrobo.uz/api/teacher/teachers/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setTeacherData(result)
    } catch (err) {

    } finally {
      setLoad(false);
    }
    []
  };

  const fetchCourse = async () => {
    setLoad(true)
    try {
      const response = await api.get("/courses/courses/");
      if (response.status == 401  || response.data?.code === "token_not_valid") {
        handleLogout();
      }
      setData(response.data);
    } catch (err) {
      console.log("err:", err);

    }
    finally {
      setLoad(false)
    }
  };

  const fetchUserData = async () => {
    try {
      setLoad(true);
      const response = await api.get("/user/auth/me/");
      if (response.status == 401 || response.data?.code === "token_not_valid") {
        handleLogout();
      }
      setUser(response.data);
    } catch (error) {

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
        user,
        setUser,
        fetchUserData,
        updateUser,
        handleLogout,
        loading,
        fetchTeam
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);