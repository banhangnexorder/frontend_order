import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function OrdersStatusTab() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/staff/orders").then(res => setOrders(res.data));
  }, []);

  return (
    <div className="orders-status">
      <h3>📦 Trạng thái đơn hôm nay</h3>

      {orders.length === 0 && <p>Chưa có đơn</p>}

      {orders.map(o => (
        <div key={o.id} className="order-row">
          <div>
            <b>#{o.id}</b> • Bàn {o.table_id}
          </div>

          <span className={`status ${o.status}`}>
            {o.status === "pending" && "⏳ Đang làm"}
            {o.status === "done" && "✅ Đã xong"}
          </span>
        </div>
      ))}
    </div>
  );
}
