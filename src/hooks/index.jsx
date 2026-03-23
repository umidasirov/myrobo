import axios from "axios";

export const useAxios = () => {
  const response = async ({
    url,
    method = "GET",
    data = null,
    headers = {},
    params = {},
    auth = true,
  }) => {
    try {
      const token = localStorage.getItem("token");

      const defaultHeaders = {
        "Content-Type": "application/json",
        ...headers,
      };

      if (auth && token) {
        defaultHeaders.Authorization = `Bearer ${token}`;
      }

      const res = await axios({
        url: `${import.meta.env.VITE_BASE_URL}${url}`,
        method,
        headers: defaultHeaders,
        params,
        data,
      });

      return res.data;
    } catch (error) {
      console.error("Axios xatolik:", error);
      if (error.response) {
        throw error.response.data;
      }
      throw error;
    }
  };

  return response;
};