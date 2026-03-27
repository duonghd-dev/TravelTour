# 📁 Frontend Architecture - Feature-Based Structure

## Cấu Trúc Mới (Tái Cấu Trúc)

```
src/
├── shared/                          # 📦 Các resource dùng chung
│   ├── components/
│   │   ├── ui/                      # Atomic components (Button, Card, Input, Modal, Table)
│   │   ├── layout/                  # Layout components (Header, Footer, Sidebar)
│   │   ├── common/                  # Common components (Toast, Banner, LoadingSpinner)
│   │   └── index.js                 # Barrel file - export tất cả components
│   └── contexts/                    # React Context (ToastContext)
│
├── features/                        # 🎯 Feature modules - tâm của ứng dụng
│   ├── auth/                        # Feature: Authentication
│   │   ├── api/
│   │   │   └── authApi.jsx
│   │   ├── components/
│   │   │   ├── LoginForm/
│   │   │   ├── RegisterForm/
│   │   │   ├── OTPForm/
│   │   │   └── ... (các auth components khác)
│   │   ├── hooks/                   # Auth-specific hooks
│   │   ├── pages/
│   │   │   ├── LoginPage/
│   │   │   ├── RegisterPage/
│   │   │   └── ... (các auth pages)
│   │   ├── types.ts                 # TypeScript types (nếu dùng TS)
│   │   └── index.js                 # Barrel file - export pages, components, API
│   │
│   ├── home/                        # Feature: Home (future)
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── index.js
│   │
│   ├── dashboard/                   # Feature: Dashboard (future)
│   ├── profile/                     # Feature: Profile (future)
│   └── index.js                     # Master barrel file cho tất cả features
│
├── hooks/                           # 🪝 Global custom hooks (dùng chung)
├── utils/                           # 🛠️ Utility functions
├── contexts/                        # 🎯 Global contexts (Redux/Zustand/Context)
├── routes/                          # 🛣️ Routing
├── pages/                           # 📄 Standalone pages (404, Layout pages)
├── assets/                          # 🎨 Styles, images, icons, videos
├── apis/                            # ⚠️ (DEPRECATED) - API calls nên ở trong features
├── layout/                          # 📐 Layouts (AdminLayout, ClientLayout, etc)
│
├── App.jsx
├── main.jsx
└── ...config files
```

## Migration Guide

### ✅ Hoàn Thành

- ✅ Tạo `shared/` folder
- ✅ Di chuyển `components/` → `shared/components/`
- ✅ Tạo barrel files cho tất cả folders
- ✅ Cập nhật `routers.js` sử dụng barrel files
- ✅ Cập nhật `contexts/ToastContext.jsx` import từ `shared/components/common`

### 📋 Tiếp Theo (Optional)

- [ ] Xóa `src/apis/` (các API nên ở `features/*/api/`)
- [ ] Xóa `src/pages/auth/`, `src/pages/Dashboard/` (rỗng)
- [ ] Tạo `features/dashboard/` và `features/profile/` khi phát triển

## Import Examples (Cách Viết Mới)

### ❌ Cũ (Hybrid - không recommended khi dự án lớn)

```javascript
import { Toast } from '@/components/common';
import LoginPage from '@/features/auth/pages/LoginPage/LoginPage';
import { registerUser } from '@/features/auth/api/authApi';
```

### ✅ Mới (Feature-Based - recommended)

```javascript
// Import từ barrel files - ngắn gọn hơn
import { Toast } from '@/shared/components';
import { LoginPage, registerUser } from '@/features/auth';
import { LoginForm } from '@/features/auth/components';

// Hoặc chi tiết hơn
import { Toast, ToastContainer } from '@/shared/components/common';
```

## Lợi Ích

1. **Scalability**: Khi thêm feature mới, chỉ tạo folder `features/newFeature`
2. **Maintainability**: Code liên quan một nơi
3. **Code Splitting**: Dễ lazy load từng feature
4. **Team Collaboration**: Mỗi feature = một team member
5. **Dependency Management**: Rõ ràng feature nào import từ đâu

## Tips

- Barrel files (`index.js`) giúp imports ngắn gọn
- Shared components độc lập, không import từ features
- Features có thể import từ shared
- API calls ở trong feature's `api/` folder
- Hooks dùng chung ở `hooks/`, hooks feature-specific ở `features/*/hooks/`
