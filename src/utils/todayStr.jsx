export const todayStr = () => {
  const now = new Date();
  now.setHours(12, 0, 0, 0); // chống lệch timezone
  return now.toISOString().slice(0, 10);
};
