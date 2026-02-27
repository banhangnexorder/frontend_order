const BASE = import.meta.env.VITE_STATIC_URL;

export function getMenuImage(image) {
  if (!image) return DEFAULT;
  if (image.startsWith("http")) return image;

  return `${BASE}/uploads/menu/${image}`;
}