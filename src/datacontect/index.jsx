import axios from "axios";
import { createContext, useContext, useState } from "react";

const DataContext = createContext();

const api = axios.create({
  baseURL: "https://api.myrobo.uz",
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
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const refresh = localStorage.getItem("refresh");
        if (!refresh) {
          handleLogout();
          return Promise.reject(error);
        }

        try {
          const res = await axios.post(
            "https://api.myrobo.uz/user/auth/token/refresh/",
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

      return Promise.reject(error);
    }
  );

  const fetchTeam = async () => {
    setLoad(true);
    try {
      const response = await fetch("https://api.myrobo.uz/teacher/teachers/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setTeacherData(result)      
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoad(false);
    }
    []
  };

  const fetchCourse = async () => {
    setLoad(true)
    try {
      const response = await api.get("/courses/courses/");
      setData(response.data);
    } catch (err) {
      console.error("Kurslar xatolik:", err);
    }
    finally{
      setLoad(false)
    }
  };

  const fetchUserData = async () => {
    try {
      setLoad(true);
      const response = await api.get("/user/auth/me/");
      setUser(response.data);
    } catch (error) {
      console.error("Foydalanuvchi xatolik:", error.response?.data || error.message);
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
      console.error("Update xatolik:", error.response?.data || error.message);
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