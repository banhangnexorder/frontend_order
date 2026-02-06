import { useState } from "react";
import { api } from "../services/api";
import "../css/admin/AdminLogin.css";
import "../css/common/buttons.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePass = () => setShowPass(!showPass);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/admin/login", {
        username,
        password,
      });

      // ✅ LƯU TOKEN
      localStorage.setItem("token", res.data.token);

      // ✅ REDIRECT THEO ROLE
      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else if (res.data.role === "staff") {
        window.location.href = "/pos";
      } else if (res.data.role === "kitchen") {
        window.location.href = "/kitchen";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>☕ Admin Panel</h2>
        <p className="subtitle">Quản lý hệ thống</p>

        {error && <div className="error">{error}</div>}

        {/* USERNAME */}
        <input
          type="text"
          placeholder="Tên đăng nhập"
          className="login-input"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        {/* PASSWORD */}
        <div className="password-box">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Mật khẩu"
            className="login-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <span className="toggle-pass" onClick={togglePass}>
            {showPass ? "🙈" : "👁️"}
          </span>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="btn btn-primary btn-full"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
}
