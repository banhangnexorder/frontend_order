import { useEffect, useRef, useState } from "react";
import "../css/staff/KitchenRealtimeOrders.css";
import { useKitchenOrders } from "../hooks/useKitchenOrders";

// Sử dụng context toàn cục để tránh bị Policy chặn khi tạo mới
let globalAudioCtx = null;

// Khởi tạo AudioContext
const initAudioContext = () => {
  if (!globalAudioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      globalAudioCtx = new AudioContext();
    }
  }
};

const playBellSound = () => {
  try {
    initAudioContext();
    if (!globalAudioCtx) return;

    // Yêu cầu resume nếu chưa tương tác (trình duyệt có thể ném cảnh báo ở đây nếu hoàn toàn chưa có user gesture)
    if (globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume();
    }

    // Nếu vẫn bị chặn thì bỏ qua (cần chờ user click)
    if (globalAudioCtx.state === "suspended") {
      console.warn("Cần tương tác màn hình để bật chuông.");
      return;
    }

    const t = globalAudioCtx.currentTime;

    const osc1 = globalAudioCtx.createOscillator();
    const gain1 = globalAudioCtx.createGain();
    osc1.connect(gain1);
    gain1.connect(globalAudioCtx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, t);
    gain1.gain.setValueAtTime(0, t);
    gain1.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.4);
    osc1.start(t);
    osc1.stop(t + 0.5);

    const osc2 = globalAudioCtx.createOscillator();
    const gain2 = globalAudioCtx.createGain();
    osc2.connect(gain2);
    gain2.connect(globalAudioCtx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, t + 0.1);
    gain2.gain.setValueAtTime(0, t + 0.1);
    gain2.gain.linearRampToValueAtTime(0.5, t + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.6);
    osc2.start(t + 0.1);
    osc2.stop(t + 0.7);
  } catch (err) {
    console.error("Lỗi âm thanh:", err);
  }
};

export default function KitchenRealtimeOrders() {
  const { orders, updateStatus } = useKitchenOrders();
  const prevOrderIdsRef = useRef(new Set());
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Hàm do con người tự tay click để mở khoá âm thanh
  const enableSound = () => {
    initAudioContext();
    if (globalAudioCtx && globalAudioCtx.state === "suspended") {
      globalAudioCtx.resume().then(() => {
        setSoundEnabled(true);
        playBellSound(); // Phát thử 1 tiếng
      });
    } else {
      setSoundEnabled(true);
      playBellSound(); 
    }
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>🍳 Màn hình nhận đơn</h1>
        
        {!soundEnabled ? (
          <button 
            onClick={enableSound}
            style={{ 
              background: '#ef4444', 
              color: 'white', 
              padding: '10px 16px', 
              borderRadius: '8px', 
              border: 'none', 
              fontWeight: 'bold', 
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)'
            }}
          >
            🔔 Bật chuông thông báo
          </button>
        ) : (
          <div style={{ color: '#10b981', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔔</span> Chuông báo đang bật
          </div>
        )}
      </div>

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