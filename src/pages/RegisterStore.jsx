import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function RegisterStore() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    store_name: "",
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.store_name || !form.username || !form.password) {
      alert("❌ Nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/register", form);

      const data = res.data;

      // 🔥 lưu token admin
      localStorage.setItem("admin_token", data.token);

      alert("🎉 Tạo cửa hàng thành công!");

      // 👉 chuyển vào admin luôn
      navigate("/admin");

    } catch (err) {
      console.error(err);
      alert("❌ Lỗi tạo cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🚀 Tạo cửa hàng mới</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input
          name="store_name"
          placeholder="Tên cửa hàng"
          value={form.store_name}
          onChange={handleChange}
        />

        <input
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />

        <button disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo cửa hàng"}
        </button>
      </form>
    </div>
  );
}