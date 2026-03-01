import axios from "axios";
import { createContext, useContext, useState } from "react";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [blogData, setBlogData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);

  const [user,UserData] = useState([])

  const fetchCourse = async () =>{
    try {
      const response = await fetch("https://api.myrobo.uz/courses/courses/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();
      setData(result);
    } catch (err) {
      console.error("Xatolik:", err);
    }
  }
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
        UserData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
