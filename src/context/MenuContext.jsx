import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Chỉ fetch nếu chưa có data
    if (menu.length === 0) {
      setLoading(true);
      api
        .get("/menu")
        .then((res) => {
          const grouped = groupMenuByCategory(res.data); // copy hàm của bạn
          setMenu(grouped);
        })
        .catch((err) => {
          console.error("❌ LOAD MENU ERROR:", err);
          setError(err);
        })
        .finally(() => setLoading(false));
    }
  }, []); // [] → chỉ chạy 1 lần khi app mount

  return (
    <MenuContext.Provider value={{ menu, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

export const useMenu = () => useContext(MenuContext);

// Copy hàm groupMenuByCategory vào đây hoặc import từ utils
function groupMenuByCategory(items) {
  const map = {};
  for (const item of items) {
    if (!map[item.category_id]) {
      map[item.category_id] = {
        id: item.category_id,
        category: item.category_name, // sau này map tên thật nếu cần
        items: [],
      };
    }
    map[item.category_id].items.push({
      id: item.id,
      name: item.name,
      price: item.price,
      area: item.area,
      image: item.image,
      has_toppings: item.has_toppings,
    });
  }
  return Object.values(map);
}