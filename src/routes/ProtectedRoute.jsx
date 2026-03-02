import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem("token");

  console.log("🔐 TOKEN:", token);

  // ❌ Không có token
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  let user;

  // 🔓 Decode token
  try {
    user = jwtDecode(token);
    console.log("👤 USER:", user);
  } catch (err) {
    console.error("❌ Invalid token", err);
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }

  // ❌ Token không có role
  if (!user?.role) {
    console.error("❌ Token has no role");
    localStorage.removeItem("token");
    return <Navigate to="/admin/login" replace />;
  }

  // ❌ Role không được phép
  if (roles.length > 0 && !roles.includes(user.role)) {
    console.warn("❌ Role not allowed:", user.role);

    if (user.role === "staff") return <Navigate to="/admin" replace />;
    if (user.role === "kitchen") return <Navigate to="/kitchen" replace />;

    return <Navigate to="/admin/login" replace />;
  }

  // ✅ OK
  return children;
}
