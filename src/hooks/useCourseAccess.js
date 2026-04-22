import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api";

export function useCourseAccess(courseId) {
  const [isBought, setIsBought] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!courseId || !token) {
      setLoading(false);
      return;
    }
    // ✅ apiFetch bilan 401 avtomatik logout
    apiFetch("https://myrobo.uz/api/courses/my-courses/")
      .then((r) => r.json())
      .then((list) => {
        const bought =
          Array.isArray(list) &&
          list.some((c) => String(c.id) === String(courseId));
        setIsBought(bought);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [courseId]);

  return { isBought, loading, token };
}
