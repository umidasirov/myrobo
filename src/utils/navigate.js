import { toSlug } from "../components/kirish";

export function goToCourse(navigate, title, id, isBought, token) {
  const slug = toSlug(title);
  localStorage.setItem("locate", id);

  if (!token) return navigate(`/kirish2/${slug}`);
  if (isBought) return navigate("/frontned/");
  return navigate(`/kirish2/${slug}`);
}
