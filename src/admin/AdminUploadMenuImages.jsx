import { useState } from "react";
import { api } from "../services/api";
import AdminHeader from "./AdminHeader";
import "../css/admin/AdminUploadMenuImages.css";

export default function AdminUploadMenuImages() {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);

  const submit = async () => {
    const form = new FormData();
    files.forEach(f => form.append("images", f));

    const res = await api.post("/menu/upload-menu-images", form);
    setResult(res.data);
  };

  return (
    <>
      <AdminHeader />
      <div className="upload-menu-image">
        <h2>📷 Upload ảnh menu</h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setFiles([...e.target.files])}
        />

        <button className="btn btn-primary" onClick={submit}>
          Upload ảnh
        </button>

        {result && (
          <div className="result">
            <p>✔ Tổng ảnh: {result.total}</p>
            <p>🎯 Match thành công: {result.matched}</p>
          </div>
        )}

        <p className="hint">
          ⚠️ Tên file phải giống tên món <br />
          VD: <b>ca-phe-den-da.jpg</b>
        </p>
      </div>
    </>
  );
}
