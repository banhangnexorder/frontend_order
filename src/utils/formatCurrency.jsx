export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "0đ";
  return amount.toLocaleString("vi-VN", { minimumFractionDigits: 0 }) + "đ";
};