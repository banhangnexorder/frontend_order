import { useEffect, useRef, useState } from "react";
import { api } from "../services/api";
import { socket } from "../services/socket";
import { todayStr } from "../utils/todayStr";
import { getUser } from "../services/auth";

export function useKitchenOrders() {
  const [orders, setOrders] = useState([]);

  const audioRef = useRef(null);
  const lastPlayRef = useRef(0);

  /* =========================
      PLAY SOUND (ANTI SPAM)
  ========================= */
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

  /* =========================
      NORMALIZE ORDER
  ========================= */
  const normalizeOrder = (order) => ({
    ...order,
    created_ts: new Date(order.created_at).getTime(),
    items: order.items || [],
  });

  /* =========================
      LOAD INITIAL ORDERS
  ========================= */
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

  /* =========================
      UPDATE STATUS
  ========================= */
  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
    } catch (err) {
      console.error("UPDATE ERROR:", err);
    }
  };

  /* =========================
      SOCKET EVENTS
  ========================= */
  useEffect(() => {

    const user = getUser();
    const storeId = user?.store_id;

    if (storeId) {
      socket.emit("join_store", storeId);
      console.log("JOIN STORE:", storeId);
    }

    /* DEBUG SOCKET */
    socket.onAny((event, ...args) => {
      console.log("SOCKET EVENT:", event, args);
    });

    loadOrders();

    audioRef.current = new Audio("/sounds/notification.mp3");
    audioRef.current.preload = "auto";

    const handleNewOrder = (order) => {
      setOrders((prev) => {
        if (prev.some((o) => o.id === order.id)) return prev;

        const normalized = normalizeOrder(order);
        return [normalized, ...prev];
      });

      playSound();
    };

    const handleOrderUpdated = (updated) => {
      setOrders((prev) => {
        if (updated.status !== "pending") {
          return prev.filter((o) => o.id !== updated.id);
        }

        return prev.map((o) =>
          o.id === updated.id ? normalizeOrder(updated) : o
        );
      });
    };

    socket.on("new_order", handleNewOrder);
    socket.on("order_updated", handleOrderUpdated);

    return () => {
      socket.off("new_order", handleNewOrder);
      socket.off("order_updated", handleOrderUpdated);

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