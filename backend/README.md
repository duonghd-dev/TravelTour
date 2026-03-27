# Hotel Travel Backend API

Express.js REST API với JWT authentication và MongoDB.

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Server chạy tại `http://localhost:5001`

## Environment Variables

```env
MONGODB_CONNECTION=mongodb+srv://...
JWT_SECRET=your-secret-key
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5500
```

## Project Structure

```
src/
├── server.js                # Express app
├── config/db.js            # MongoDB connection
├── models/User.js          # User schema
├── controllers/userControllers.js
├── routes/userRouters.js
└── middleware/authMiddleware.js
```

## API Routes

### Authentication

- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `PUT /api/auth/change-password/:id` - Đổi mật khẩu

### Profile

- `GET /api/auth/profile/:id` - Lấy profile
- `PUT /api/auth/profile/:id` - Cập nhật profile

### Admin

- `GET /api/users` - Danh sách user
- `PUT /api/users/:id/status` - Cập nhật status
- `DELETE /api/users/:id` - Xóa user

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Bcryptjs (password hashing)
- Validator (input validation)
