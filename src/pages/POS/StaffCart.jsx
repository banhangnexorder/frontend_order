import { api } from "../../services/api";
import { formatCurrency } from "../../utils/formatCurrency";

export default function StaffCart({ cart, setCart }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const submitOrder = async () => {
    if (!cart.length) return;

    await api.post("/orders", {
      items: cart,
      source: "staff"
    });

    setCart([]);
    alert("✅ Gửi đơn thành công");
  };

  return (
    <div className="staff-cart">
      <h3>🧾 Đơn hàng</h3>

      {cart.map(i => (
        <div key={i.id} className="cart-row">
          <span>{i.name} × {i.qty}</span>
          <span>{formatCurrency(i.price * i.qty)}</span>
        </div>
      ))}

      <div className="cart-total">
        <b>{formatCurrency(total)}</b>
      </div>

      <button onClick={submitOrder} disabled={!cart.length}>
        Gửi bếp
      </button>
    </div>
  );
}
