import React from "react";
import "../css/Card.css";

const Card = () => {
  return (
    <div className="card">
      <div className="card-image">
        <img
          src="https://images.unsplash.com/photo-1561882468-9110e03e0f78?auto=format&w=600&q=80"
          alt="Card"
        />
      </div>

      <div className="card-content">
        <h3>Tiêu đề Card</h3>
        <p>
          Đây là phần nội dung text bên phải. Bạn có thể đặt mô tả,
          thông tin sản phẩm hoặc bất kỳ nội dung nào ở đây.
        </p>
        <button>Xem thêm</button>
      </div>
    </div>
  );
};

export default Card;
