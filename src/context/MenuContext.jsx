import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

     const token = localStorage.getItem("qr_token");

    console.log("TOKEN:", token);

    if (!token) {
      setLoading(false);
      setError("Missing QR token");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      console.log("QR PAYLOAD:", payload);

      // 👉 CALL API (KHÔNG cần store_id nữa)
      api.get("/menu", {
        headers: {
          "x-qr-token": token
        }
      })
      .then(res => {
        console.log("MENU RAW:", res.data);
        setMenu(groupMenuByCategory(res.data));
      })
      .catch(err => {
        console.error("MENU ERROR:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));

    } catch (err) {
      console.error("❌ INVALID TOKEN:", err);
      setError("Token không hợp lệ");
      setLoading(false);
    }

  }, []);

  return (
    <MenuContext.Provider value={{ menu, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);


/* ===== GROUP MENU ===== */

function groupMenuByCategory(items) {

  const map = {};

  for (const item of items) {

    if (!map[item.category_id]) {
      map[item.category_id] = {
        id: item.category_id,
        category: item.category_name,
        items: []
      };
    }

    map[item.category_id].items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      area: item.area,
      image: item.image_url, // dùng luôn url backend
      has_toppings: item.has_toppings
    });

  }

  return Object.values(map);
}