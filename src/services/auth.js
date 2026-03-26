export function getUser() {
  const token = localStorage.getItem("admin_token");
  if (!token) return null;

  return JSON.parse(atob(token.split(".")[1]));
}
