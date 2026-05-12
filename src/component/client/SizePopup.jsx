import React, { useState } from "react";
import "../../css/client/SizePopup.css";
import { formatCurrency } from "../../utils/formatCurrency";

export default function SizePopup({ item, onClose, onConfirm }) {
  // Tìm size có giá thấp nhất để chọn mặc định
  const getInitialSize = () => {
    if (item.price_s > 0) return "S";
    if (item.price_m > 0) return "M";
    if (item.price_l > 0) return "L";
    return "";
  };

  const [selectedSize, setSelectedSize] = useState(getInitialSize());

  const getPriceForSize = (size) => {
    if (size === "S") return item.price_s;
    if (size === "M") return item.price_m;
    if (size === "L") return item.price_l;
    return item.price;
  };

  const handleConfirm = () => {
    if (!selectedSize) {
      onConfirm(item);
      return;
    }
    
    const sizeItem = {
      ...item,
      size: selectedSize,
      price: getPriceForSize(selectedSize)
    };
    onConfirm(sizeItem);
  };

  return (
    <div className="size-popup-overlay">
      <div className="size-popup-content">
        <h3>Chọn Size cho {item.name}</h3>
        <div className="size-options">
          {item.price_s > 0 && (
            <label className={`size-option ${selectedSize === "S" ? "selected" : ""}`}>
              <input
                type="radio"
                name="size"
                value="S"
                checked={selectedSize === "S"}
                onChange={() => setSelectedSize("S")}
              />
              <span className="size-label">Size S</span>
              <span className="size-price">{formatCurrency(item.price_s)}</span>
            </label>
          )}
          {item.price_m > 0 && (
            <label className={`size-option ${selectedSize === "M" ? "selected" : ""}`}>
              <input
                type="radio"
                name="size"
                value="M"
                checked={selectedSize === "M"}
                onChange={() => setSelectedSize("M")}
              />
              <span className="size-label">Size M</span>
              <span className="size-price">{formatCurrency(item.price_m)}</span>
            </label>
          )}
          {item.price_l > 0 && (
            <label className={`size-option ${selectedSize === "L" ? "selected" : ""}`}>
              <input
                type="radio"
                name="size"
                value="L"
                checked={selectedSize === "L"}
                onChange={() => setSelectedSize("L")}
              />
              <span className="size-label">Size L</span>
              <span className="size-price">{formatCurrency(item.price_l)}</span>
            </label>
          )}
        </div>
        
        <div className="size-popup-actions">
          <button className="btn-cancel" onClick={onClose}>Hủy</button>
          <button className="btn-confirm-size" onClick={handleConfirm}>Xác nhận</button>
        </div>
      </div>
    </div>
  );
}
