export const todayStr = () => {
  const now = new Date();
  now.setHours(12, 0, 0, 0); // chống lệch timezone
  console.log("🔥 todayStr:",now.toISOString().slice(0, 10));
  return now.toISOString().slice(0, 10);
};
