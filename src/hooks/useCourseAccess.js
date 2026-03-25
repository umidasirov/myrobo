import { useState, useEffect } from "react";

export function useCourseAccess(courseId) {
  const [isBought, setIsBought] = useState(false);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!courseId || !token) {
      setLoading(false);
      return;
    }
    fetch("https://myrobo.uz/api/courses/my-courses/", {
      headers: { Authorization: `Bearer ${token}` },
    })
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
