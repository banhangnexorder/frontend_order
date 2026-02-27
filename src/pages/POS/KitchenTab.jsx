import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "../../services/api";
import { io } from "socket.io-client";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});

export default function KitchenTab({ area = "all" }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("pending"); // all | pending | done
  const [sortMode, setSortMode] = useState("new"); // new | old
  const [newOrderId, setNewOrderId] = useState(null);

  const audioRef = useRef(null);
  const firstLoad = useRef(true);

  /* =========================
      SOCKET + LOAD DATA
  ========================= */
  useEffect(() => {
    audioRef.current = new Audio("/sounds/notification.mp3");

    socket.connect();

    socket.on("new_order", (order) => {
      setOrders((prev) => {
        // ✅ FIX TRÙNG ĐƠN REALTIME
        if (prev.some((o) => o.id === order.id)) return prev;
        return [order, ...prev];
      });

      if (!firstLoad.current) {
        audioRef.current.play().catch(() => {});
        setNewOrderId(order.id);
        setTimeout(() => setNewOrderId(null), 3000);
      }
    });

    socket.on("order_updated", (updated) => {
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    });

    api.get("/orders/cm01").then((res) => {
      setOrders(res.data);
      firstLoad.current = false;
    });

    return () => {
      socket.off("new_order");
      socket.off("order_updated");
      socket.disconnect();
    };
  }, []);

  /* =========================
      FILTER STATUS
  ========================= */
  const filteredOrders = useMemo(() => {
    // MODE KHÔNG CHIA KHU
    if (area === "all") {
      if (filter === "all") return orders;
      return orders.filter(o => o.status === filter);
    }

    // MODE CHIA KHU
    if (filter === "all") return orders;

    return orders.filter(o => {
      const areaStatus = o.areas_status?.[area];
      if (!areaStatus) return false;
      return areaStatus === filter;
    });
  }, [orders, filter, area]);


  /* =========================
      SORT (CHỈ pending)
  ========================= */
  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (a.status !== "pending" || b.status !== "pending") return 0;

      const t1 = new Date(a.created_at).getTime();
      const t2 = new Date(b.created_at).getTime();

      return sortMode === "new" ? t2 - t1 : t1 - t2;
    });
  }, [filteredOrders, sortMode]);

  /* =========================
      FILTER THEO AREA
  ========================= */
  const visibleOrders = useMemo(() => {
    if (area === "all") return sortedOrders;

    return sortedOrders.filter((order) =>
      order.items?.some((i) => i.area === area)
    );
  }, [sortedOrders, area]);

  /* =========================
      MARK AREA DONE
  ========================= */
  const markDone = async (order) => {
    try {
      // MODE KHÔNG CHIA KHU
      if (area === "all") {
        await api.put(`/orders/${order.id}/status`, { status: "done" });
        return;
      }

      // MODE CHIA KHU
      await api.put(`/orders/${order.id}/area-status`, {
        area,
      });
    } catch (err) {
      console.error("❌ MARK DONE ERROR:", err);
    }
  };



  /* =========================
      CHECK AREA DONE?
  ========================= */
  const isAreaDone = (order) => {
    if (area === "all") return order.status === "done";
    return order.areas_status?.[area] === "done";
  };

  return (
    <div className="kitchen-page">
      <h2 className="section-title">
        {area === "all"
          ? "🍽️ Tất cả đơn"
          : area === "kitchen"
          ? "🍳 Bếp"
          : "☕ Pha chế"}
      </h2>

      {/* ===== FILTER ===== */}
      <div className="kitchen-filter">
        {[
          { key: "all", label: "Tất cả" },
          { key: "pending", label: "Đang làm" },
          { key: "done", label: "Hoàn thành" },
        ].map((f) => (
          <button
            key={f.key}
            className={filter === f.key ? "active" : ""}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ===== SORT ===== */}
      <div className="kitchen-sort">
        <button
          className={sortMode === "new" ? "active" : ""}
          onClick={() => setSortMode("new")}
        >
          🔥 Đơn mới lên trên
        </button>
        <button
          className={sortMode === "old" ? "active" : ""}
          onClick={() => setSortMode("old")}
        >
          🕒 Đơn cũ lên trên
        </button>
      </div>

      {/* ===== ORDER LIST ===== */}
      {visibleOrders.length === 0 ? (
        <p className="empty">Không có đơn.</p>
      ) : (
        visibleOrders.map((order) => (
          <div
            key={order.id}
            className={`order-card ${
              order.id === newOrderId ? "highlight" : ""
            }`}
          >
            <div className="order-top">
              <span>
                <b>Đơn #{order.id}</b> • Bàn {order.table_id}
              </span>
              <span className={`status ${order.status}`}>
                {order.status === "pending" ? "Đang làm" : "Hoàn thành"}
              </span>
            </div>

            {/* ===== ITEMS ===== */}
            <ul className="order-items">
              {(area === "all"
                ? order.items
                : order.items.filter((i) => i.area === area)
              ).map((i, idx) => (
                <li key={idx}>
                  {i.name} × {i.qty}
                </li>
              ))}
            </ul>

            {/* ===== FOOTER ===== */}
            <div className="order-footer">
              <span className="total">
                Tổng: {Number(order.total).toLocaleString()}đ
              </span>

              {order.status === "pending" && !isAreaDone(order) && (
                <button
                  className="btn-done"
                  onClick={() => markDone(order)}
                >
                  ✅ Xong {area === "all" ? "đơn" : "khu"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
