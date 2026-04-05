import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import "../css/register.css";

export default function RegisterStore() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    store_name: "",
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.store_name || !form.username || !form.password) {
      alert("Nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/register", form);
      const data = res.data;

      localStorage.setItem("admin_token", data.token);

      // 🔥 gọi QR ngay
      const qr = await api.get(`/qr/generate?store_id=${data.store_id}&table_id=1`);

      setQrUrl(qr.data.url);

    } catch (err) {
      console.error(err);
      alert("Lỗi tạo cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h2>🚀 Tạo quán trong 10 giây</h2>
        <p className="sub">Không cần setup phức tạp</p>

        {!qrUrl ? (
          <form onSubmit={handleSubmit}>
            <input
              name="store_name"
              placeholder="Tên quán (vd: Cà phê Mộc)"
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
              {loading ? "Đang tạo..." : "Tạo quán ngay"}
            </button>
          </form>
        ) : (
          <div className="success">
            <h3>🎉 Xong rồi!</h3>
            <p>Quét QR để xem menu</p>

            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrUrl}`}
              alt="QR"
            />

            <button onClick={() => navigate("/admin")}>
              Vào trang quản lý
            </button>
          </div>
        )}
      </div>
    </div>
  );
}