src/
├── pages/
│   ├── POS/
│   │   ├── OrderTab.jsx     ← Nhân viên order tại quầy
│   │   ├── KitchenTab.jsx   ← Bếp xem đơn realtime
│   │   └── index.jsx        ← Component quản lý 2 tab
│   ├── MenuPage.jsx         ← QR khách hàng (vẫn giữ)
│   ├── CartPage.jsx
│   └── SuccessPage.jsx
├── context/
│   ├── CartContext.jsx
│   ├── POSContext.jsx       ← lưu state riêng cho POS
│   └── SocketContext.jsx    ← socket dùng chung realtime
└── services/
    ├── api.js
    └── socket.js
├─ admin/
│  ├─ AdminDashboard.jsx
│  ├─ AdminOrders.jsx
│  ├─ AdminLogin.jsx     👈 LOGIN UI
│  ├─ AdminRoute.jsx     👈 PROTECT ROUTE




    /admin
 ├─ Dashboard (tổng quan)
 ├─ Orders (toàn bộ đơn)
 └─ (sau này) Staff / Report



/api/admin/dashboard
  ?range=today
  ?range=7days
  ?range=month
  ?range=year

Frontend (React)
 ├─ Login Admin
 ├─ Lưu token (JWT)
 ├─ Gửi token lên API
 ├─ AdminRoute kiểm tra role


 src/
├─ services/
│  └─ api.js             👈 axios + interceptor
├─ admin/
│  ├─ AdminDashboard.jsx
│  ├─ AdminOrders.jsx
│  ├─ AdminLogin.jsx     👈 LOGIN UI
│  ├─ AdminRoute.jsx     👈 PROTECT ROUTE
├─ css/
│  └─ common/buttons.css
├─ App.jsx



| Role        | Được vào                           |
| ----------- | ---------------------------------- |
| **admin**   | Dashboard, Orders, Stats           |
| **staff**   | POS                                |
| **kitchen** | Kitchen / KitchenFood / KitchenBar |
| ❌           | Không role → login                 |


DEV  → local developer
STG  → staging (test trước khi release)
PROD → production (khách dùng thật)




frontend_order
 ├── main      → Vercel PROD
 ├── staging   → Vercel STG
 ├── develop
 └── feature/*