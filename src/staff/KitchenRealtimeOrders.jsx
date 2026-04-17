import { useEffect, useRef } from "react";
import "../css/staff/KitchenRealtimeOrders.css";
import { useKitchenOrders } from "../hooks/useKitchenOrders";

// Hàm phát tiếng chuông Ting Ting nhẹ nhàng (2 nhịp) sử dụng biến đổi sóng âm thanh trực tiếp
const playBellSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.1);
    gain2.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    osc2.start(ctx.currentTime + 0.1);
    osc2.stop(ctx.currentTime + 0.7);
  } catch (err) {
    console.log("Không thể phát âm thanh", err);
  }
};

export default function KitchenRealtimeOrders() {
  const { orders, updateStatus } = useKitchenOrders();
  const prevOrderIdsRef = useRef(new Set());

  useEffect(() => {
    if (!orders || orders.length === 0) return;

    let hasNewOrder = false;
    const currentIds = new Set(orders.map((o) => o.id));

    // Bỏ qua lần render đầu tiên khi vừa mở trang chứa nhiều đơn cũ
    if (prevOrderIdsRef.current.size === 0) {
      prevOrderIdsRef.current = currentIds;
      return;
    }

    orders.forEach((order) => {
      // Kêu chuông nếu ID đơn hoàn toàn mới và đang chờ xử lý
      if (!prevOrderIdsRef.current.has(order.id) && order.status === "pending") {
        hasNewOrder = true;
      }
    });

    if (hasNewOrder) {
      playBellSound();
    }

    prevOrderIdsRef.current = currentIds;
  }, [orders]);

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