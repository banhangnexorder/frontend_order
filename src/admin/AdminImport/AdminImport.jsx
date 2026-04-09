import { useState } from "react";
import { api } from "../../services/api";
import AdminHeader from "../AdminHeader";
import "../../css/admin/AdminImport.css";
import "../../css/common/buttons.css";

export default function AdminImport() {
  const [file, setFile] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null); // đổi thành object để dễ xử lý message + details

  const submit = async () => {
    if (!file) {
      setError({ message: "Vui lòng chọn file Excel (.xlsx hoặc .xls)" });
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("overwrite", overwrite);

      const res = await api.post("/admin/menu-management/full", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("IMPORT menu-management:", res.data);

      setResult(res.data);
    } catch (err) {
      setError({
        message: err.response?.data?.message || "Import thất bại",
        details: err.response?.data?.errors || [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminHeader />

      <main className="import-main">
        <div className="import-container">
          <h1 className="page-title">Import Menu từ Excel</h1>

          <div className="import-card">
            <div className="upload-zone">
              <label className="file-label">
                <span>Chọn file Excel</span>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              {file && <p className="file-name">Đã chọn: {file.name}</p>}
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
              />
              <span>Ghi đè toàn bộ menu hiện tại (xóa dữ liệu cũ)</span>
            </label>

            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={submit}
              disabled={loading || !file}
            >
              {loading ? (
                <>⏳ Đang xử lý...</>
              ) : (
                <>🚀 Import Menu</>
              )}
            </button>

            {error && (
              <div className="alert alert-error">
                <strong>{error.message}</strong>
                {error.details?.length > 0 && (
                  <ul>
                    {error.details.map((msg, i) => (
                      <li key={i}>{msg}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {result && (
              <div className="alert alert-success">
                <strong>Import thành công!</strong>
                <p>{result.message}</p>
                <div className="result-stats">
                  <div>Menu items: <strong>{result.menu || 0}</strong></div>
                  <div>Toppings: <strong>{result.toppings || 0}</strong></div>
                  <div>Liên kết: <strong>{result.links || 0}</strong></div>
                </div>
              </div>
            )}

            <div className="hint-box">
              <p><strong>Yêu cầu file Excel:</strong></p>
              <ul>
                <li>Sheet <code>menu</code>: id, name, price, category_id, ...</li>
                <li>Sheet <code>toppings</code>: id, name, price, ...</li>
                <li>Sheet <code>menu_toppings</code>: menu_id, topping_id</li>
              </ul>
              <p className="small">File mẫu sẽ được cung cấp khi cần.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}