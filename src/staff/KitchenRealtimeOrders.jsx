import "../css/staff/KitchenRealtimeOrders.css";
import { useKitchenOrders } from "../hooks/useKitchenOrders";

export default function KitchenRealtimeOrders() {
  const { orders, updateStatus } = useKitchenOrders();

  return (
    <div className="kitchen-page">
      <h1>🍳 Màn hình nhận đơn</h1>

      {orders.length === 0 && (
        <div className="empty">Chưa có đơn mới</div>
      )}

      <div className="orders-grid">
        {orders.map((order) => (
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
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-main">
                    {item.qty} x {item.name}
                  </div>

                  {item.has_toppings &&
                    item.toppings?.length > 0 && (
                      <div className="item-toppings">
                        {item.toppings.map((top) => (
                          <div
                            key={top.id}
                            className="topping-line"
                          >
                            + {top.name} x {top.qty}
                          </div>
                        ))}
                      </div>
                    )}

                  {item.note && (
                    <div className="item-note">
                      📝 {item.note}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="status">
              {order.status === "pending" && "⏳ Đang làm"}
              {order.status === "done" && "✅ Đã xong"}
              {order.status === "cancelled" && "❌ Đã huỷ"}
            </div>

            <div className="actions">
              <button
                className="btn done"
                onClick={() =>
                  updateStatus(order.id, "done")
                }
              >
                Hoàn thành
              </button>

              <button
                className="btn cancel"
                onClick={() =>
                  updateStatus(order.id, "cancelled")
                }
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