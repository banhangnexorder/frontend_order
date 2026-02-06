// src/component/cart/ToppingPopup.jsx
import "../../css/ToppingPopup.css";

export default function ToppingPopup({ item, toppings, onClose, onChangeQty }) {
  if (!item) return null;

  return (
    <div className="popup-overlay">
      <div className="popup topping-popup">
        <h3>{item.name}</h3>

        <div className="topping-list">
          {(toppings || []).map(t => {
            const selected =
              item.toppings.find(x => x.id === t.id) || { qty: 0 };

            return (
              <div key={t.id} className="topping-row">
                <div className="topping-info">
                  <b>{t.name}</b>
                  <span>+{t.price.toLocaleString()}đ</span>
                </div>

                {t.max_quantity === 1 ? (
                  <input
                    type="checkbox"
                    checked={selected.qty === 1}
                    onChange={() =>
                      onChangeQty(
                        item.id,
                        t,
                        selected.qty === 1 ? -1 : 1
                      )
                    }
                  />
                ) : (
                  <div className="qty-control">
                    <button
                      disabled={selected.qty === 0}
                      onClick={() => onChangeQty(item.id, t, -1)}
                    >
                      −
                    </button>
                    <span>{selected.qty}</span>
                    <button
                      disabled={selected.qty >= t.max_quantity}
                      onClick={() => onChangeQty(item.id, t, 1)}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="btn-confirm" onClick={onClose}>
          Xong
        </button>
      </div>
    </div>
  );
}
