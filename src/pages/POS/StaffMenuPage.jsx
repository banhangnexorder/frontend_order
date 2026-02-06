import { useEffect, useState } from "react";
import "../../css/StaffMenuPage.css";
import { api } from "../../services/api";

export default function StaffMenuPage({ onAdd }) {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/menu")
      .then(res => setMenu(res.data))
      .catch(err => console.error("❌ MENU LOAD ERROR:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading">Đang tải menu...</p>;

  return (
    <div className="staff-menu">
      {menu.map(category => (
        <section key={category.id} className="category-block">
          <h3 className="category-title">{category.category}</h3>

          <div className="menu-grid">
            {category.items.map(item => (
              <div
                key={item.id}
                className="menu-card"
                onClick={() => onAdd(item)}
              >
                <div className="img-box">
                  <img src={item.image} alt={item.name} />
                </div>

                <div className="info">
                  <h4>{item.name}</h4>
                  <p className="price">
                    {item.price.toLocaleString()}đ
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
