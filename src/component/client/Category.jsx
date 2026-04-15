import "../../css/client/Category.css";
import React, { useContext } from "react";
import Item from "./Item";
import { CartContext } from "../../context/CartContext";
import { getMenuImage } from "../../utils/menuImage";


export default function Category({ title, items, onAdd }) {
  const { cart } = useContext(CartContext);

  return (
    <section className="category">
      <h3 className="category-title">{title}</h3>

      <div className="grid">
        {items.map((item) => {
          console.log("ITEMMMMMMM: ", item);
          const normalizedItem = {
            ...item,
            image: item.image || item.image_url,
            price: item.price || 0,
            id: item.id || 0,
            name: item.name || "",
            qty: item.qty || 0,
            selected: item.selected || false,
            onAdd: item.onAdd || (() => { }),
          };

          const cartItem = cart.find((c) => c.id === normalizedItem.id);

          return (
            <Item
              key={normalizedItem.id}
              img={getMenuImage(normalizedItem.image)}
              name={normalizedItem.name}
              price={normalizedItem.price}
              selected={!!cartItem}
              qty={cartItem?.qty || 0}
              onAdd={() => onAdd(normalizedItem)}
            />
          );
        })}
      </div>
    </section>
  );
}
