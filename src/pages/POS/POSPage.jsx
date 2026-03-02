import { useState } from "react";
import MenuPage from "../../pages/MenuPage";
// import OrdersStatusTab from "./OrdersStatusTab";
import AdminOrders from "../../admin/AdminOrders"

export default function POSPage() {
  const [tab, setTab] = useState("order");

  return (
    <>
      {/* <div className="pos-tabs">
        <button onClick={() => setTab("order")}>🧾 Order</button>
        <button onClick={() => setTab("status")}>📦 Đơn hàng</button>
      </div> */}

      {/* {tab === "order" && <MenuPage />} */}
      <AdminOrders />
    </>
  );
}
