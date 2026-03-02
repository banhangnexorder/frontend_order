import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../css/admin/AdminOrders.css";
import { todayStr } from "../utils/todayStr.jsx";
import AdminHeader from "./AdminHeader";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");

  const [quick, setQuick] = useState("today");
  const [from, setFrom] = useState(todayStr());
  const [to, setTo] = useState(todayStr());

  useEffect(() => {
    setLoading(true);
    api
      .get("/admin/orders", { params: { status, from, to } })
      .then((res) => setOrders(res.data || []))
      .catch((err) => console.error("Lỗi tải đơn:", err))
      .finally(() => setLoading(false));
  }, [status, from, to]);

  const selectToday = () => {
    const d = todayStr();
    setFrom(d);
    setTo(d);
    setQuick("today");
  };

  const selectMonth = () => {
    const now = new Date();
    const fromDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    setFrom(fromDate);
    setTo(todayStr());
    setQuick("month");
  };

  const selectYear = () => {
    const year = new Date().getFullYear();
    setFrom(`${year}-01-01`);
    setTo(todayStr());
    setQuick("year");
  };

  useEffect(() => {
    selectToday();
  }, []);

  return (
    <div className="admin-layout">
      <AdminHeader />

      <main className="admin-main">
        <div className="orders-container">
          <h1 className="page-title">Quản lý Đơn hàng</h1>

          {/* Filter Section */}
          <div className="filter-section">
            <div className="date-range">
              <input
                type="date"
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value);
                  setQuick("");
                }}
                className="date-input"
              />
              <span className="date-separator">đến</span>
              <input
                type="date"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                  setQuick("");
                }}
                className="date-input"
              />
            </div>

            <div className="quick-buttons">
              <button
                className={`quick-btn ${quick === "today" ? "active" : ""}`}
                onClick={selectToday}
              >
                Hôm nay
              </button>
              <button
                className={`quick-btn ${quick === "month" ? "active" : ""}`}
                onClick={selectMonth}
              >
                Tháng này
              </button>
              <button
                className={`quick-btn ${quick === "year" ? "active" : ""}`}
                onClick={selectYear}
              >
                Năm nay
              </button>
            </div>

            <div className="status-buttons">
              {["all", "pending", "done"].map((s) => (
                <button
                  key={s}
                  className={`status-btn ${status === s ? "active" : ""}`}
                  onClick={() => setStatus(s)}
                >
                  {s === "all" ? "Tất cả" : s === "pending" ? "Đang làm" : "Hoàn thành"}
                </button>
              ))}
            </div>
          </div>

          {/* Orders */}
          {loading ? (
            <div className="loading-state">Đang tải danh sách đơn hàng...</div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p>Không có đơn hàng nào trong khoảng thời gian này.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div>
                      <span className="order-id">#{order.id}</span>
                      <span className="order-table"> • Bàn {order.table_id}</span>
                    </div>
                    <span className={`status-badge ${order.status}`}>
                      {order.status === "pending" ? "Đang làm" : "Hoàn thành"}
                    </span>
                  </div>

                  <div className="order-time">
                    {new Date(order.created_at).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      {Number(order.total).toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}