import { useEffect, useState } from "react";
import { api } from "../services/api";
import { socket } from "../services/socket"; // socket bạn đã tạo
import "../css/staff/KitchenRealtimeOrders.css";
import { todayStr } from "../utils/todayStr.jsx";



export default function KitchenRealtimeOrders() {
  const [orders, setOrders] = useState([]);

  // Load đơn ban đầu
  const loadOrders = () => {
    api
        .get("/admin/orders", {
        params: {
            status: "pending",
            from: todayStr(),
            to: todayStr(),
        },
        })
        .then(res => setOrders(res.data || []))
        .catch(err => console.error("LOAD ERROR:", err));
    };

  useEffect(() => {
    loadOrders();

    // 🔥 Nhận đơn mới realtime
    socket.on("new_order", (order) => {
      setOrders(prev => [order, ...prev]);
    });

    // 🔥 Khi đơn được update trạng thái
    socket.on("order_updated", (updated) => {
      setOrders(prev => {
        // Nếu đơn không còn pending → xoá khỏi danh sách
        if (updated.status !== "pending") {
          return prev.filter(o => o.id !== updated.id);
        }

        // Nếu vẫn pending → update bình thường
        return prev.map(o => (o.id === updated.id ? updated : o));
      });
    });

    return () => {
      socket.off("new_order");
      socket.off("order_updated");
    };
  }, []);

  // Đổi trạng thái
  const updateStatus = async (id, status) => {
      try {
      await api.put(`/orders/${id}/status`, { status });

      if (status !== "pending") {
        setOrders(prev => prev.filter(o => o.id !== id));
      }

    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  return (
    <div className="kitchen-page">
      <h1>🍳 Màn hình nhận đơn</h1>

      {orders.length === 0 && (
        <div className="empty">Chưa có đơn mới</div>
      )}

      <div className="orders-grid">
        {orders.map(order => (
          <div key={order.id} className={`order-card ${order.status}`}>
            
            <div className="header">
              <div>
                <b>#{order.id}</b> • Bàn {order.table_id}
              </div>
              <span className="time">
                {new Date(order.created_at).toLocaleTimeString("vi-VN")}
              </span>
            </div>

            <div className="items">
              {order.items?.map(item => (
                <div key={item.id} className="item">
                  {item.name} × {item.qty}
                </div>
              ))}
            </div>

            <div className="status">
              {order.status === "pending" && "⏳ Đang làm"}
              {order.status === "done" && "✅ Đã xong"}
              {order.status === "cancelled" && "❌ Đã huỷ"}
            </div>

            <div className="actions">
              {/* <button
                className="btn doing"
                onClick={() => updateStatus(order.id, "pending")}
              >
                Nhận làm
              </button> */}

              <button
                className="btn done"
                onClick={() => updateStatus(order.id, "done")}
              >
                Hoàn thành
              </button>

              <button
                className="btn cancel"
                onClick={() => updateStatus(order.id, "cancelled")}
              >
                Huỷ
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}