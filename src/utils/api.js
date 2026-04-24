/**
 * ✅ Global Fetch Wrapper
 * Barcha API call'lar uchun 401 avtomatik logout'ni handle qiladi
 */

let logoutCallback = null;

export const setGlobalLogoutCallback = (callback) => {
  logoutCallback = callback;
};

export const apiFetch = async (url, options = {}) => {
  try {
    // Authorization header'ni qo'shish
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // ✅ 401 → LOGOUT CALLBACK CHAQIRISH
    if (response.status === 401) {
      // logoutCallback chaqirish (handleLogoutAnother)
      if (logoutCallback) {
        logoutCallback();
      } else {
        // Agar callback bo'lmasa - oddiy logout
        localStorage.removeItem("token");
        localStorage.removeItem("balance");
        localStorage.removeItem("phone");
        localStorage.removeItem("user_id");
        localStorage.removeItem("username");
        localStorage.removeItem("refresh");
        localStorage.removeItem("locate");
        
        if (typeof window !== "undefined") {
          window.location.href = "/kirish2";
        }
      }
      return response;
    }

    return response;
  } catch (error) {
    throw error;
  }
};
