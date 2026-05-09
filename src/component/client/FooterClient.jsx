import React from "react";
import "../../css/client/Footer.css";
import { formatCurrency } from "../../utils/formatCurrency";

export default function Footer({ total = 0, onViewCart }) {
  return (
    <footer className="bottom-bar">
      <div className="bottom-inner">
        <span>Tổng cộng: {formatCurrency(total)}</span>
        <button onClick={onViewCart}>Xem giỏ hàng →</button>
      </div>
    </footer>
  );
}
