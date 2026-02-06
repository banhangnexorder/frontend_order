// src/pages/MenuPage.jsx (giữ nguyên hầu hết logic, chỉ thêm class & icon)
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiSearch, FiCoffee } from "react-icons/fi"; // Thêm icon
import "../css/MenuPage.css";
import { api } from "../services/api";
import { CartContext } from "../context/CartContext";
import { useMenu } from "../context/MenuContext";
import FooterClient from "../component/client/FooterClient";
import Category from "../component/client/Category";
import AppHeader from "../component/common/AppHeader";
import { normalizeText } from "../utils/normalizeText";

export default function MenuPage() {
  const { cart, addItem } = useContext(CartContext);
  const { menu, loading, error } = useMenu();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tableInfo, setTableInfo] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    const table = searchParams.get("table");
    const store = searchParams.get("store");
    const info = { table, store };
    setTableInfo(info);

    if (table && store) {
      localStorage.setItem("tableInfo", JSON.stringify(info));
    }
  }, [searchParams]);

  const filteredMenu = useMemo(() => {
    if (!menu || menu.length === 0) return [];

    const key = normalizeText(keyword).toLowerCase();

    return menu
      .filter((cat) => category === "all" || cat.id === category)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) =>
          normalizeText(item.name).toLowerCase().includes(key)
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [menu, keyword, category]);

  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div className="app">
      <AppHeader title="☕ Cà phê Mộc" />

      {/* Table Info - Sticky top nếu cần */}
      {tableInfo?.table && (
        <div className="table-info">
          <span>🏠 Chi nhánh: {tableInfo.store || "Không xác định"}</span>
          <span>🪑 Bàn {tableInfo.table}</span>
        </div>
      )}

      {/* Search & Filter */}
      <div className="menu-filter single-row-filter">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm món ăn, đồ uống..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="mobile-input"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mobile-select"
        >
          <option value="all">Tất cả</option>
          {menu.map((c) => (
            <option key={c.id} value={c.id}>
              {c.category}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Content */}
      <main className="content">
        {loading ? (
          <div className="loading-mobile">
            <FiCoffee className="spin-icon" />
            <p>Đang tải menu...</p>
          </div>
        ) : error ? (
          <div className="error-mobile">
            <FiAlertCircle size={48} />
            <p>Lỗi tải menu. Kiểm tra kết nối và thử lại nhé!</p>
          </div>
        ) : filteredMenu.length === 0 ? (
          <div className="empty-mobile">
            <p>
              {keyword ? "Không tìm thấy món phù hợp 😔" : "Danh mục này đang trống"}
            </p>
          </div>
        ) : (
          filteredMenu.map((cat) => (
            <Category key={cat.id} title={cat.category} items={cat.items} cart={cart} onAdd={addItem} />
          ))
        )}
      </main>

      <FooterClient total={total} onViewCart={() => navigate("/cart")} />
    </div>
  );
}