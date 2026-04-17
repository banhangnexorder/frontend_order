import { useState } from "react";
import QRCode from "react-qr-code";
import "../css/qrpage.css";
import AdminHeader from "./AdminHeader";

export default function QRPrintPage() {
  const [qrs, setQrs] = useState([]);
  const [tableCount, setTableCount] = useState(10);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const store_id = user?.store_id;

  const generateQRs = async () => {
    if (!store_id || !tableCount || tableCount <= 0) return;

    setLoading(true);
    try {
      const promises = [];
      // Sử dụng Promise.all để fetch song song thay vì tuần tự (sẽ nhanh hơn rất nhiều)
      for (let i = 1; i <= tableCount; i++) {
        promises.push(
          fetch(`/api/qr/generate?store_id=${store_id}&table_id=${i}`)
            .then(res => res.json())
            .then(data => ({ table: i, url: data.url }))
        );
      }

      const results = await Promise.all(promises);
      setQrs(results);
    } catch (err) {
      console.error("Error generating QRs", err);
      alert("Đã có lỗi xảy ra khi tạo QR. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminHeader />

      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Quản lý & In QR Bàn</h2>

        {/* Vùng form nhập (ẩn đi khi in nhờ class print:hidden của Tailwind) */}
        <div className="flex flex-wrap gap-4 items-end mb-8 bg-white p-5 rounded-lg shadow-sm border print:hidden">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">Số lượng bàn cần tạo:</label>
            <input
              type="number"
              min="1"
              value={tableCount}
              onChange={(e) => setTableCount(parseInt(e.target.value) || "")}
              className="border border-gray-300 p-2 rounded-md w-32 focus:ring focus:ring-blue-200 outline-none"
            />
          </div>
          <button
            onClick={generateQRs}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400 font-medium transition"
          >
            {loading ? "Đang tạo mã..." : "Tạo QR Bàn"}
          </button>

          {qrs.length > 0 && (
            <button
              onClick={() => window.print()}
              className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 font-medium transition"
            >
              In danh sách QR
            </button>
          )}
        </div>

        {/* Vùng hiển thị QR để in */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {qrs.map(qr => (
            <div key={qr.table} className="border border-dashed border-gray-400 p-4 text-center bg-white rounded-lg flex flex-col items-center justify-center break-inside-avoid">
              <h3 className="text-xl font-bold mb-4">Bàn {qr.table}</h3>
              {qr.url ? <QRCode value={qr.url} size={140} /> : <p className="text-red-500 text-sm">Lỗi URL</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}