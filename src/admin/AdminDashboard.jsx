import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../css/admin/AdminDashboard.css";
import "../css/common/buttons.css";
import AdminHeader from "./AdminHeader";
import OrdersChart from "../component/admin/OrdersChart";


export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState("today");

  useEffect(() => {
    api
      .get("/admin/dashboard", { params: { range } })
      .then(res => setStats(res.data))
      .catch(err => {
        console.error("❌ DASHBOARD ERROR:", err);
      });
  }, [range]);


  if (!stats) return <p className="loading">Đang tải dashboard...</p>;

  return (
    <>
    <AdminHeader/>
    <div className="admin-dashboard">
      <h2>📊 Tổng quan</h2>

      {/* ===== RANGE ===== */}
      <div className="btn-group">
        {[
          ["today", "Hôm nay"],
          ["7days", "7 ngày"],
          ["month", "Tháng này"],
          ["year", "Năm nay"],
        ].map(([key, label]) => (
          <button
            className={`btn ${range === key ? "active" : ""}`}
            key={key}
            onClick={() => setRange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ===== STATS ===== */}
      <div className="stats-grid">
        <StatBox label="Tổng đơn" value={stats.totalOrders} />
        <StatBox label="Đang làm" value={stats.pendingOrders} color="pending" />
        <StatBox label="Hoàn thành" value={stats.doneOrders} color="done" />
        <StatBox label="Đã huỷ" value={stats.cancelledOrders} color="cancelled" />
        <StatBox
          label="Doanh thu"
          value={stats.revenue.toLocaleString() + "đ"}
          color="revenue"
        />
      </div>

      {stats.chart?.length > 0 && (
        <OrdersChart data={stats.chart} />
      )}
  

      {/* ===== LATE ORDERS ===== */}
      <div className="late-orders">
        <h3>⚠️ Đơn làm quá lâu (&gt;15 phút)</h3>

        {stats.lateOrders.length === 0 ? (
          <p className="empty">Không có đơn trễ 🎉</p>
        ) : (
          stats.lateOrders.map(o => (
            <div key={o.id} className="late-row">
              <span>
                <b>#{o.id}</b> • Bàn {o.table_id}
              </span>
              <span className="late-time">{o.minutes} phút</span>
            </div>
          ))
        )}
      </div>
    </div>
    </>
    
  );
}

function StatBox({ label, value, color }) {
  return (
    <div className={`stat-box ${color || ""}`}>
      <div className="value">{value}</div>
      <div className="label">{label}</div>
    </div>
  );
}
