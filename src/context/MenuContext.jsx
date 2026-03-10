import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const store_id = params.get("store");

    console.log("STORE:", store_id);
    console.log("FULL URL:", window.location.href);
    console.log("SEARCH:", window.location.search);

    if (!store_id) {
      setLoading(false);
      return;
    }

    api.get("/menu", {
      params: { store_id }
    })
    .then(res => {
      console.log("MENU RAW:", res.data);
      setMenu(groupMenuByCategory(res.data));
    })
    .catch(err => {
      console.error("MENU ERROR:", err);
    })
    .finally(() => setLoading(false));

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