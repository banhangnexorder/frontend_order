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

/* ===== AUTH ===== */
import ProtectedRoute from "./routes/ProtectedRoute";

import AdminUploadMenuImage from "./admin/AdminUploadMenuImages";

import AdminMenuManagement from "./admin/AdminMenuManagement";

import { MenuProvider } from "./context/MenuContext";

export default function App() {
  return (
    <MenuProvider>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* ===== CLIENT ===== */}
          <Route path="/" element={<MenuPage />} />
          <Route path="/cart" element={<CartPage />} />
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

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/menu-management"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminMenuManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/upload-menu-images"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AdminUploadMenuImage />
              </ProtectedRoute>
            }
          />


          {/* ===== STAFF / POS ===== */}
          <Route
            path="/pos"
            element={
              <ProtectedRoute roles={["staff", "admin"]}>
                <POSPage />
              </ProtectedRoute>
            }
          />

          {/* ===== KITCHEN ===== */}
          <Route
            path="/kitchen"
            element={
              // <ProtectedRoute roles={["kitchen", "admin"]}>
                <KitchenScreen />
              // </ProtectedRoute>
            }
          />

          <Route
            path="/kitchenfood"
            element={
              <ProtectedRoute roles={["kitchen", "admin"]}>
                <KitchenTab area="kitchen" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/kitchenbar"
            element={
              <ProtectedRoute roles={["kitchen", "admin"]}>
                <KitchenTab area="bar" />
              </ProtectedRoute>
            }
          />

          {/* ===== FALLBACK ===== */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
    </MenuProvider>
  );
}
