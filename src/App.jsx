import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartProvider } from "./context/CartContext";

/* ===== CLIENT ===== */
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import SuccessPage from "./pages/SuccessPage";

/* ===== STAFF / POS ===== */
import POSPage from "./pages/POS/POSPage";

/* ===== KITCHEN ===== */
import KitchenScreen from "./pages/KitchenScreen";
import KitchenTab from "./pages/POS/KitchenTab";

/* ===== ADMIN ===== */
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminOrders from "./admin/AdminOrders";
import AdminUploadMenuImage from "./admin/AdminUploadMenuImages";
import AdminMenuManagement from "./admin/AdminMenuManagement";

/* ===== AUTH ===== */
import ProtectedRoute from "./routes/ProtectedRoute";

/* ===== CONTEXT ===== */
import { MenuProvider } from "./context/MenuContext";

/* ===== STAFF ===== */
import KitchenRealtimeOrders from "./staff/KitchenRealtimeOrders";
import RegisterStore from "./pages/RegisterStore";
import QRPrintPage from "./admin/QRPrintPage";

export default function App() {
  return (
    <BrowserRouter>

      <CartProvider>

        <Routes>


          {/* ===== REGISTER Store cho khách hàng ===== */}
          <Route path="/register" element={<RegisterStore />} />

          {/* ===== CLIENT MENU (QR MENU) ===== */}
          <Route
            path="/menu"
            element={
              <MenuProvider>
                <MenuPage />
              </MenuProvider>
            }
          />
          {/* ===== CLIENT CART ===== */}
          <Route path="/cart" element={<CartPage />} />
          {/* ===== Đặt hàng thành công ===== */}
          <Route path="/success" element={<SuccessPage />} />

          {/* ===== ADMIN LOGIN ===== */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ===== ADMIN ===== */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ===== ADMIN ORDERS - Dành cho trang quản lý ===== */}
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />
          {/* ===== ADMIN PRINT QR - IN QR bàn ===== */}
          <Route
            path="/admin/print-qr"
            element={
              <ProtectedRoute roles={["admin"]}>
                <QRPrintPage />
              </ProtectedRoute>
            }
          />

          {/* ===== ADMIN MENU MANAGEMENT - Dành cho trang quản lý ===== */}
          <Route
            path="/admin/menu-management"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminMenuManagement />
              </ProtectedRoute>
            }
          />

          {/* ===== ADMIN UPLOAD MENU IMAGES - Dành cho trang quản lý ===== */}
          <Route
            path="/admin/upload-menu-images"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUploadMenuImage />
              </ProtectedRoute>
            }
          />

          {/* ===== POS ===== */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute roles={["staff", "admin"]}>
                <POSPage />
              </ProtectedRoute>
            }
          />

          {/* ===== STAFF ORDERS - MÀN HÌNH DÀNH CHO BẾP TIẾP NHẬN ĐƠN ===== */}
          <Route
            path="/staff/order"
            element={
              <ProtectedRoute roles={["staff", "admin"]}>
                <KitchenRealtimeOrders />
              </ProtectedRoute>
            }
          />

          {/* ===== KITCHEN ===== */}
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute roles={["kitchen", "admin"]}>
                <KitchenScreen />
              </ProtectedRoute>
            }
          />

          {/* ===== KITCHEN FOOD - MÀN HÌNH DÀNH CHO BẾP MÓN ĂN ===== */}
          <Route
            path="/kitchenfood"
            element={
              <ProtectedRoute roles={["kitchen", "admin"]}>
                <KitchenTab area="kitchen" />
              </ProtectedRoute>
            }
          />

          {/* ===== KITCHEN BAR - MÀN HÌNH DÀNH CHO QUẦY BAR ===== */}
          <Route
            path="/kitchenbar"
            element={
              <ProtectedRoute roles={["kitchen", "admin"]}>
                <KitchenTab area="bar" />
              </ProtectedRoute>
            }
          />

          {/* ===== FALLBACK - MẶC ĐỊNH ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}