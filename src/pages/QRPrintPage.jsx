import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "../css/qrpage.css";

export default function QRPrintPage() {
  const [qrs, setQrs] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const store_id = user?.store_id;

  useEffect(() => {
    const load = async () => {
      const arr = [];

      for (let i = 1; i <= 10; i++) {
        const res = await fetch(
          `/api/qr/generate?store_id=${store_id}&table_id=${i}`
        );
        const data = await res.json();

        arr.push({
          table: i,
          url: data.url
        });
      }

      setQrs(arr);
    };

    load();
  }, [store_id]);

  return (
    <div className="admin-layout">
          <AdminHeader />
            <div className="grid grid-cols-3 gap-4 p-4">
            {qrs.map(qr => (
                <div key={qr.table} className="border p-4 text-center">
                <h3>Bàn {qr.table}</h3>
                <QRCode value={qr.url} size={150} />
                </div>
            ))}
            </div>
    </div>
  );
}