import "../../css/client/Header.css";
import React, { useContext } from "react";
import { CartContext } from "../../context/CartContext";
import { Link } from "react-router-dom";

export default function HeaderClient() {
  const { cart } = useContext(CartContext);

  // Tính tổng số món trong giỏ
  const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <header className="header-client">
      <h2>☕ Cà phê Mộc</h2>

      {/* Dẫn sang trang giỏ hàng */}
      <Link to="/cart" className="cart">
        🛒 {totalQty > 0 ? `(${totalQty})` : ""}
      </Link>
    </header>
  );
}
