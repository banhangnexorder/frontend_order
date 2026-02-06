import KitchenTab from "./POS/KitchenTab";
import "../css/KitchenScreen.css";

export default function KitchenScreen() {
  return (
    <div className="kitchen-screen">
      <header className="kitchen-header">
        <h1>🍳 KHU BẾP</h1>
        <span className="kitchen-clock">
          {new Date().toLocaleTimeString("vi-VN")}
        </span>
      </header>

      <main className="kitchen-body">
        <KitchenTab />
      </main>
    </div>
  );
}
