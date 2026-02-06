// src/admin/AdminMenuManagement.jsx
import { useState } from "react";
import { api } from "../services/api";
import AdminHeader from "./AdminHeader";
import "../css/admin/AdminMenuManagement.css"; // CSS mới, gộp chung

export default function AdminMenuManagement() {
  const [activeTab, setActiveTab] = useState("import"); // "import" hoặc "upload"

  // --- Phần Import Excel ---
  const [importFile, setImportFile] = useState(null);
  const [overwrite, setOverwrite] = useState(true);
  const [importLoading, setImportLoading] = useState(false);
  const [importResult, setImportResult] = useState(null);
  const [importError, setImportError] = useState(null);

  const handleImport = async () => {
    if (!importFile) {
      setImportError({ message: "Vui lòng chọn file Excel (.xlsx hoặc .xls)" });
      return;
    }

    setImportLoading(true);
    setImportError(null);
    setImportResult(null);

    try {
      const form = new FormData();
      form.append("file", importFile);
      form.append("overwrite", overwrite);

      const res = await api.post("/admin/import/full", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImportResult(res.data);
    } catch (err) {
      setImportError({
        message: err.response?.data?.message || "Import thất bại",
        details: err.response?.data?.errors || [],
      });
    } finally {
      setImportLoading(false);
    }
  };

  // --- Phần Upload Images ---
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const handleUpload = async () => {
    if (imageFiles.length === 0) {
      setUploadError("Vui lòng chọn ít nhất một ảnh");
      return;
    }

    setUploadLoading(true);
    setUploadError(null);
    setUploadResult(null);

    try {
      const form = new FormData();
      imageFiles.forEach((file) => form.append("images", file));

      const res = await api.post("/menu/upload-menu-images", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadResult(res.data);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload ảnh thất bại");
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminHeader />

      <main className="admin-main">
        <div className="container">
          <h1 className="page-title">Quản lý Menu</h1>

          {/* Tabs */}
          <div className="tabs">
            <button
              className={`tab ${activeTab === "import" ? "active" : ""}`}
              onClick={() => setActiveTab("import")}
            >
              Import từ Excel
            </button>
            <button
              className={`tab ${activeTab === "upload" ? "active" : ""}`}
              onClick={() => setActiveTab("upload")}
            >
              Upload ảnh món
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "import" && (
              <div className="import-section">
                <div className="card">
                  <h2>📥 Import Menu từ file Excel</h2>

                  <div className="upload-zone">
                    <label className="file-label">
                      Chọn file Excel
                      <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    {importFile && <p className="file-name">Đã chọn: {importFile.name}</p>}
                  </div>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={overwrite}
                      onChange={(e) => setOverwrite(e.target.checked)}
                    />
                    <span>Ghi đè toàn bộ menu cũ</span>
                  </label>

                  <button
                    className={`btn btn-primary ${importLoading ? "loading" : ""}`}
                    onClick={handleImport}
                    disabled={importLoading || !importFile}
                  >
                    {importLoading ? "⏳ Đang import..." : "🚀 Import Menu"}
                  </button>

                  {importError && (
                    <div className="alert alert-error">
                      <strong>{importError.message}</strong>
                      {importError.details?.length > 0 && (
                        <ul>{importError.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
                      )}
                    </div>
                  )}

                  {importResult && (
                    <div className="alert alert-success">
                      <p>✅ {importResult.message}</p>
                      <div className="stats">
                        <div>Menu: <strong>{importResult.menu}</strong></div>
                        <div>Toppings: <strong>{importResult.toppings}</strong></div>
                        <div>Liên kết: <strong>{importResult.links}</strong></div>
                      </div>
                    </div>
                  )}

                  <div className="hint">
                    <p>File cần có 3 sheet: <code>menu</code>, <code>toppings</code>, <code>menu_toppings</code></p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "upload" && (
              <div className="upload-section">
                <div className="card">
                  <h2>📷 Upload ảnh cho menu</h2>

                  <div className="upload-zone">
                    <label className="file-label">
                      Chọn nhiều ảnh (jpg, png, ...)
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setImageFiles([...(e.target.files || [])])}
                      />
                    </label>

                    {imageFiles.length > 0 && (
                      <p className="file-name">
                        Đã chọn {imageFiles.length} ảnh
                      </p>
                    )}
                  </div>

                  <button
                    className={`btn btn-primary ${uploadLoading ? "loading" : ""}`}
                    onClick={handleUpload}
                    disabled={uploadLoading || imageFiles.length === 0}
                  >
                    {uploadLoading ? "⏳ Đang upload..." : "🚀 Upload ảnh"}
                  </button>

                  {uploadError && (
                    <div className="alert alert-error">
                      <strong>{uploadError}</strong>
                    </div>
                  )}

                  {uploadResult && (
                    <div className="alert alert-success">
                      <p>✔ Upload thành công</p>
                      <p>Tổng ảnh: <strong>{uploadResult.total}</strong></p>
                      <p>Match thành công: <strong>{uploadResult.matched}</strong></p>
                    </div>
                  )}

                  <div className="hint">
                    <p>⚠️ Tên file phải khớp tên món (ví dụ: <b>ca-phe-den-da.jpg</b>)</p>
                    <p>Ảnh sẽ tự động gán cho món tương ứng.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
