import { useState } from "react";
import StaffMenuPage from "./StaffMenuPage";
import OrdersStatusTab from "./OrdersStatusTab";

export default function POSPage() {
  const [tab, setTab] = useState("order");

  return (
    <>
      <div className="pos-tabs">
        <button onClick={() => setTab("order")}>🧾 Order</button>
        <button onClick={() => setTab("status")}>📦 Đơn hàng</button>
      </div>

      {tab === "order" && <StaffMenuPage />}
      {tab === "status" && <OrdersStatusTab />}
    </>
  );
}
