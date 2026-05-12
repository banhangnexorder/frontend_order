// src/context/CartContext.jsx
import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  /* ===== ADD ITEM ===== */
  const addItem = (item) => {
    setCart(prev => {
      const cartItemId = item.size ? `${item.id}_${item.size}` : item.id;
      const exist = prev.find(i => i.cartItemId === cartItemId);
      if (exist) {
        return prev.map(i =>
          i.cartItemId === cartItemId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          ...item,
          cartItemId,
          qty: 1,
          note: "",
          toppings: []
        }
      ];
    });
  };

  /* ===== REMOVE ITEM ===== */
  const removeItem = (cartItemId) => {
    setCart(prev =>
      prev
        .map(i =>
          i.cartItemId === cartItemId ? { ...i, qty: i.qty - 1 } : i
        )
        .filter(i => i.qty > 0)
    );
  };

  const deleteItem = (cartItemId) => {
    setCart(prev => prev.filter(i => i.cartItemId !== cartItemId));
  };

  const updateNote = (cartItemId, note) => {
    setCart(prev =>
      prev.map(i => (i.cartItemId === cartItemId ? { ...i, note } : i))
    );
  };

  /* ===== TOPPING QTY (KHÔNG NHẢY SỐ) ===== */
  const updateToppingQty = (cartItemId, topping, delta) => {
    setCart(prev =>
      prev.map(item => {
        if (item.cartItemId !== cartItemId) return item;

        const exist = item.toppings.find(t => t.id === topping.id);
        let newToppings;

        if (!exist && delta > 0) {
          newToppings = [...item.toppings, { ...topping, qty: 1 }];
        } else if (exist) {
          const newQty = exist.qty + delta;
          if (newQty <= 0) {
            newToppings = item.toppings.filter(t => t.id !== topping.id);
          } else {
            newToppings = item.toppings.map(t =>
              t.id === topping.id ? { ...t, qty: newQty } : t
            );
          }
        } else {
          newToppings = item.toppings;
        }

        return { ...item, toppings: newToppings };
      })
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        deleteItem,
        updateNote,
        updateToppingQty,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
