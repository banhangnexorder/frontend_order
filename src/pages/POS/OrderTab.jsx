import { useState } from "react";
import { api } from "../../services/api";

export default function OrderTab() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [orders, setOrders] = useState([]);

  const addItem = () => {
    if (!name || !price) return;
    setItems([...items, { name, price: Number(price), qty: 1 }]);
    setName("");
    setPrice("");
  };

  const sendOrder = async () => {
    if (items.length === 0) return;
    try {
      const res = await api.post("/orders", {
        store_id: "cm01",
        table_id: "pos",
        source: "pos",
        items,
        total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      });
      setOrders([res.data.order, ...orders]);
      setItems([]);
      alert("✅ Gửi đơn thành công!");
    } catch (err) {
      alert("❌ Không gửi được đơn");
    }
  };

  return (
    <div>
      <h2 className="section-title">🧾 Order tại quầy</h2>

      <div className="add-item">
        <input
          placeholder="Tên món"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Giá"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={addItem}>+</button>
      </div>

      <ul className="item-list">
        {items.map((i, idx) => (
          <li key={idx}>
            {i.name} - {i.price.toLocaleString()}đ
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <button onClick={sendOrder} className="btn-send">
          Gửi đơn
        </button>
      )}

      <hr className="divider" />

      <h3 className="section-subtitle">📜 Lịch sử đơn</h3>
      {orders.map((o) => (
        <div key={o.id} className="order-history">
          <p>Đơn #{o.id} - {o.total.toLocaleString()}đ</p>
        </div>
      ))}
    </div>
  );
}
