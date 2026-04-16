import "../../css/client/Item.css";
import React, { useState } from "react";
import defaultImg from "../../assets/default_df.png";

export default function Item({ img, name, price, onAdd, selected, qty = 0 }) {
  const [animate, setAnimate] = useState(false);

  const handleClick = () => {
    setAnimate(true);
    onAdd();
    setTimeout(() => setAnimate(false), 300);
  };

  return (
    <div className={`item-card ${selected ? "selected" : ""}`}>
      {/* khung ảnh */}
      <div className="item-img-wrapper">
        <img
          src={img || defaultImg}
          alt={name}
          className="item-img"
          onError={(e) => {
            const target = e.currentTarget;

            // nếu đã là ảnh default thì dừng, không xử lý nữa
            if (target.src.includes("default_df.png")) return;

            // gỡ onError để tránh loop
            target.onerror = null;

            // fallback về ảnh mặc định
            target.src = defaultImg;
          }}
        />

        {/* badge số lượng */}
        {qty > 0 && <div className="item-qty-badge">x{qty}</div>}

        {/* nút cộng */}
        <button
          className={`btn-add-corner ${animate ? "animate" : ""}`}
          onClick={handleClick}
        >
          +
        </button>
      </div>

      {/* nội dung */}
      <div className="item-info">
        <div className="item-name">{name}</div>
        <div className="item-price">{price}đ</div>
      </div>
    </div>
  );
}
