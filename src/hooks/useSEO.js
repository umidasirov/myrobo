// src/hooks/useSEO.js
// Har bir sahifa uchun dinamik meta taglarni o'rnatadi

import { useEffect } from "react";

/**
 * Sahifa meta taglarini dinamik o'rnatish
 * @param {Object} options
 * @param {string} options.title - Sahifa title
 * @param {string} options.description - Meta description (max 160 belgi)
 * @param {string} [options.image] - OG image URL
 * @param {string} [options.url] - Canonical URL
 * @param {string} [options.type] - OG type (website | article)
 */
export function useSEO({ title, description, image, url, type = "website" }) {
  useEffect(() => {
    const BASE_URL = "https://myrobo.uz";
    const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

    // Title
    document.title = title
      ? `${title} | MyRobo.uz`
      : "MyRobo.uz — Online Dasturlash Kurslari";

    const setMeta = (selector, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("[name") ? "name" : "property";
        const key = selector.match(/["']([^"']+)["']/)?.[1];
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    };

    setMeta('[name="description"]', description || "");
    setMeta('[name="robots"]', "index, follow");

    setMeta('[property="og:title"]', title || "MyRobo.uz");
    setMeta('[property="og:description"]', description || "");
    setMeta('[property="og:image"]', image || DEFAULT_IMAGE);
    setMeta('[property="og:url"]', url || BASE_URL);
    setMeta('[property="og:type"]', type);

    setMeta('[name="twitter:title"]', title || "MyRobo.uz");
    setMeta('[name="twitter:description"]', description || "");
    setMeta('[name="twitter:image"]', image || DEFAULT_IMAGE);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url || BASE_URL);
  }, [title, description, image, url, type]);
}
