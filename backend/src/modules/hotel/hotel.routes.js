import express from 'express';
import * as hotelController from './hotel.controller.js';

const router = express.Router();

// 📖 GET - Lấy tất cả hotel (với filter, search, pagination)
router.get('/', hotelController.getAllHotels);

// 🔎 GET - Tìm kiếm hotel
router.get('/search', hotelController.searchHotels);

// 📊 GET - Lấy hotel theo category
router.get('/category/:category', hotelController.getByCategory);

// 🔍 GET - Lấy chi tiết 1 hotel
router.get('/:id', hotelController.getHotelById);

// ➕ POST - Tạo hotel mới (admin)
router.post('/', hotelController.createHotel);

// ✏️ PATCH - Cập nhật hotel
router.patch('/:id', hotelController.updateHotel);

// 🗑️ DELETE - Xóa hotel
router.delete('/:id', hotelController.deleteHotel);

export default router;
