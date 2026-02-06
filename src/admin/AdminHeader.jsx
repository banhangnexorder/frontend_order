import { NavLink, useNavigate } from "react-router-dom";
import "../css/admin/AdminHeader.css";
import "../css/common/buttons.css";

export default function AdminHeader() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <header className="admin-header">
      {/* LEFT */}
      <div className="left">
        ☕ <span>Admin Panel</span>
      </div>

      {/* CENTER NAV */}
      <nav className="nav">
        <NavLink to="/admin" end>
          Dashboard
        </NavLink>

        <NavLink to="/admin/orders">
          Orders
        </NavLink>

        <NavLink to="/admin/menu-management">
          Upload Menu
        </NavLink>
      </nav>

      {/* RIGHT */}
      <button className="btn btn-outline btn-sm" onClick={logout}>
        Đăng xuất
      </button>
    </header>
  );
}
