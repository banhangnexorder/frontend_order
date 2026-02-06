import React from "react";
import "../../css/client/Footer.css";

export default function Footer({ total = 0, onViewCart }) {
  return (
    <footer className="bottom-bar">
      <div className="bottom-inner">
        <span>Tổng cộng: {total.toLocaleString()}đ</span>
        <button onClick={onViewCart}>Xem giỏ hàng →</button>
      </div>
    </footer>
  );
}
