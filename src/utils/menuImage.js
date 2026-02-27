const BASE = `${import.meta.env.VITE_API_URL}/uploads/menu`;
const DEFAULT = `https://shorthand.com/the-craft/raster-images/assets/5kVrMqC0wp/sh-unsplash_5qt09yibrok-4096x2731.jpeg`;

export function getMenuImage(image) {
  if (!image) return DEFAULT;
  return `${BASE}/${image}.webp`;
}
