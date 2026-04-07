import { Link, useLocation } from "react-router-dom";
import "../css/SuccessPage.css";
import { FiCheckCircle } from "react-icons/fi";
import { formatCurrency } from "../utils/formatCurrency";

export default function SuccessPage() {
  const location = useLocation();
  const order = location.state?.order || {};
  const token = localStorage.getItem("qr_token");

  return (
    <div className="success-page">
      {/* ===== HEADER ===== */}
      <header className="success-header">
        <FiCheckCircle className="success-icon" />
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã gọi món tại <strong>Cà phê Mộc</strong> ☕</p>
      </header>

      {/* ===== NỘI DUNG ===== */}
      <main className="success-content">
        <div className="success-card">
          <div className="order-info">
            <p><span className="label">🧾 Mã đơn:</span> <strong>{order.id || "—"}</strong></p>
            <p><span className="label">🪑 Bàn:</span> <strong>{order.table_id || "—"}</strong></p>
            {/* <p><span className="label">🏠 Chi nhánh:</span> <strong>{order.store_id || "—"}</strong></p> */}
            <p><span className="label">🕓 Thời gian:</span> {order.time || new Date().toLocaleString("vi-VN")}</p>
          </div>

          {/* DANH SÁCH MÓN */}
          {order.items?.length > 0 && (
            <>
              <div className="divider" />
              <div className="order-items">
                <p className="section-title">🧋 Món đã đặt:</p>
                {order.items.map((item, idx) => (
                  <div key={idx} className="order-item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-qty">x{item.qty}</span>
                    <span className="item-price">{formatCurrency(Number((item.qty * item.price)))}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="divider" />

          {/* TỔNG TIỀN */}
          <div className="order-total">
            <span>Tổng cộng:</span>
            <span>{formatCurrency(Number(order.total) || 0)}</span>
          </div>
        </div>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="success-footer">
        <Link to={`/menu?t=${token}`} className="btn-back">
          ← Tiếp tục gọi món
        </Link>
      </footer>
    </div>
  );
}
