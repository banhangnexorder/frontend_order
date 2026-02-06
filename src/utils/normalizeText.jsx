export const normalizeText = (text = "") => {
  return text
    .toLowerCase()
    .normalize("NFD")                 // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")     // bỏ ký tự đặc biệt
    .trim();
};
