// src/pages/CartPage.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import AppHeader from "../component/common/AppHeader";
import { FiArrowLeft, FiMinus, FiPlus } from "react-icons/fi";
import { getMenuImage } from "../utils/menuImage";
import ToppingPopup from "../component/cart/ToppingPopup";
import "../css/CartPage.css";
import { LuMinus, LuPlus } from "react-icons/lu";

export default function CartPage() {
  const {
    cart,
    addItem,
    removeItem,
    deleteItem,
    updateNote,
    updateToppingQty,
    clearCart
  } = useContext(CartContext);

  const navigate = useNavigate();

  const [tableInfo, setTableInfo] = useState({});
  const [toppingsMap, setToppingsMap] = useState({});
  const [selectingItemId, setSelectingItemId] = useState(null);

  /* ===== LOAD TABLE ===== */
  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("tableInfo") || "{}");
    setTableInfo(info);
  }, []);

  /* ===== LOAD TOPPINGS ===== */
  const loadToppings = async (menuId) => {
    if (toppingsMap[menuId]) return;

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/menu/${menuId}/toppings`
    );
    const data = await res.json();

    setToppingsMap(prev => ({
      ...prev,
      [menuId]: Array.isArray(data) ? data : []
    }));
  };

  /* ===== GET CURRENT ITEM (SOURCE OF TRUTH) ===== */
  const selectingItem = cart.find(i => i.id === selectingItemId);

  /* ===== TOTAL ===== */
  const total = cart.reduce((sum, item) => {
    const toppingTotal = (item.toppings || []).reduce(
      (s, t) => s + t.price * t.qty,
      0
    );
    return sum + (item.price + toppingTotal) * item.qty;
  }, 0);

  /* ===== SUBMIT ===== */
  const submitOrder = async () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("t");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        t: token,     // 🔥 QUAN TRỌNG
        items: cart,
        total
      })
    });

    const data = await res.json();

    if (!data.success || !data.order) {
      alert("❌ Đặt đơn thất bại");
      return;
    }

    clearCart();

    navigate("/success", {
      state: { order: data.order }
    });
  };


  return (
    <div className="cart-page">
      <AppHeader title="Giỏ hàng" leftIcon={<FiArrowLeft />} leftLink="/" />

      <main className="cart-content">
        {cart.length === 0 ? (
          <p className="empty">Giỏ hàng trống 😅</p>
        ) : (
          cart.map(item => (
            <div key={item.id} className="cart-item">
              <img
                src={getMenuImage(item.image)}
                alt={item.name}
                className="cart-img"
              />

              <div className="cart-info">
                <b>{item.name}</b>
                <p>{item.price.toLocaleString()}đ</p>

                {/* ===== TOPPING BUTTON ===== */}
                {item.has_toppings && (
                  <button
                    className="btn-topping"
                    onClick={() => {
                      setSelectingItemId(item.id);
                      loadToppings(item.id);
                    }}
                  >
                    ➕ Chọn topping
                  </button>
                )}

                {/* ===== SELECTED TOPPINGS ===== */}
                {(item.toppings || []).map(t => (
                  <div key={t.id} className="cart-topping">
                    + {t.name} x{t.qty}
                  </div>
                ))}

                <textarea
                  className="custom-textarea"
                  placeholder="Ghi chú..."
                  value={item.note || ""}
                  onChange={e =>
                    updateNote(item.id, e.target.value)
                  }
                />

                <div className="cart-actions">
                  <button 
                  className="btn-qty"
                    onClick={() => removeItem(item.id)}
                  >
                    -
                  </button>
                  <span>{item.qty}</span>
                  <button 
                  className="btn-qty"
                  onClick={() => addItem(item)}>
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="cart-footer fixed-footer">
        <div className="footer-total">
          <span>Tổng cộng:</span>
          <b>{total.toLocaleString()}đ</b>
        </div>
        
        <button 
          className="btn-submit" 
          onClick={submitOrder} 
          disabled={cart.length === 0}
        >
          Đặt đơn
        </button>
      </footer>

      {/* ===== TOPPING POPUP ===== */}
      {selectingItem && (
        <ToppingPopup
          item={selectingItem}
          toppings={toppingsMap[selectingItem.id]}
          onChangeQty={updateToppingQty}
          onClose={() => setSelectingItemId(null)}
        />
      )}
    </div>
  );
}
