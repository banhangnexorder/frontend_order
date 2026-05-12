import "../../css/client/Category.css";
import React, { useContext, useState } from "react";
import Item from "./Item";
import { CartContext } from "../../context/CartContext";
import { getMenuImage } from "../../utils/menuImage";
import SizePopup from "./SizePopup";

export default function Category({ title, items, onAdd }) {
  const { cart } = useContext(CartContext);
  const [selectingSizeItem, setSelectingSizeItem] = useState(null);

  const handleAddClick = (item) => {
    if (item.price_s > 0 || item.price_m > 0 || item.price_l > 0) {
      setSelectingSizeItem(item);
    } else {
      onAdd(item);
    }
  };

  const handleSizeConfirm = (itemWithSize) => {
    onAdd(itemWithSize);
    setSelectingSizeItem(null);
  };

  return (
    <section className="category">
      <h3 className="category-title">{title}</h3>

      <div className="grid">
        {items.map((item) => {
          const normalizedItem = {
            ...item,
            image: item.image || item.image_url,
            price: item.price || 0,
            id: item.id || 0,
            name: item.name || "",
            qty: item.qty || 0,
            selected: item.selected || false,
          };

          // Tổng số lượng của item này trong giỏ hàng (bất kể size nào)
          const totalQtyInCart = cart
            .filter((c) => c.id === normalizedItem.id)
            .reduce((sum, c) => sum + c.qty, 0);

          return (
            <Item
              key={normalizedItem.id}
              img={getMenuImage(normalizedItem.image)}
              name={normalizedItem.name}
              price={normalizedItem.price}
              selected={totalQtyInCart > 0}
              qty={totalQtyInCart}
              onAdd={() => handleAddClick(normalizedItem)}
            />
          );
        })}
      </div>

      {selectingSizeItem && (
        <SizePopup
          item={selectingSizeItem}
          onClose={() => setSelectingSizeItem(null)}
          onConfirm={handleSizeConfirm}
        />
      )}
    </section>
  );
}
