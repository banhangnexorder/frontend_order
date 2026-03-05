import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { socket } from "../services/socket";
import { todayStr } from "../utils/todayStr.jsx";

export function useKitchenOrders() {
  const [orders, setOrders] = useState([]);
  const audioRef = useRef(null);
  const lastPlayRef = useRef(0);

  // 🔊 Play sound có throttle
  const playSound = () => {
    if (
      audioRef.current &&
      Date.now() - lastPlayRef.current > 1000
    ) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      lastPlayRef.current = Date.now();
    }
  };

  // 📦 Normalize order
  const normalizeOrder = (order) => ({
    ...order,
    created_ts: new Date(order.created_at).getTime(),
    items: order.items || [],
  });

  // 📥 Load initial orders
  const loadOrders = async () => {
    try {
      const res = await api.get("/admin/orders", {
        params: {
          status: "pending",
          from: todayStr(),
          to: todayStr(),
        },
      });

      const safeData = (res.data || [])
        .map(normalizeOrder)
        .sort((a, b) => b.created_ts - a.created_ts);

      setOrders(safeData);
    } catch (err) {
      console.error("LOAD ERROR:", err);
    }
  };

  // 🔄 Update status
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  useEffect(() => {
    loadOrders();

    // 🔊 Init audio
    audioRef.current = new Audio("/sound.wav");
    audioRef.current.preload = "auto";
    audioRef.current.load();

    // 🆕 New order
    socket.on("new_order", (order) => {
      setOrders((prev) => {
        if (prev.some((o) => o.id === order.id)) return prev;

        const normalized = normalizeOrder(order);
        return [normalized, ...prev];
      });

      playSound();
    });

    // 🔄 Order updated
    socket.on("order_updated", (updated) => {
      setOrders((prev) => {
        if (updated.status !== "pending") {
          return prev.filter((o) => o.id !== updated.id);
        }

        return prev.map((o) =>
          o.id === updated.id ? normalizeOrder(updated) : o
        );
      });
    });

    return () => {
      socket.off("new_order");
      socket.off("order_updated");

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  return {
    orders,
    updateStatus,
    reload: loadOrders,
  };
}