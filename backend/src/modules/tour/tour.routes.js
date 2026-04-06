import express from 'express';
import * as tourController from './tour.controller.js';

const router = express.Router();

// 📖 GET - Lấy tất cả tour (với filter, search, pagination)
router.get('/', tourController.getAllTours);

// 🔎 GET - Tìm kiếm tour
router.get('/search', tourController.searchTours);

// 📊 GET - Lấy tour theo region
router.get('/region/:region', tourController.getByRegion);

// ⏱️ GET - Lấy tour theo duration (số ngày)
router.get('/duration/:days', tourController.getByDuration);

// 🔍 GET - Lấy chi tiết 1 tour
router.get('/:id', tourController.getTourById);

// ➕ POST - Tạo tour mới (admin)
router.post('/', tourController.createTour);

// ✏️ PATCH - Cập nhật tour
router.patch('/:id', tourController.updateTour);

// 🗑️ DELETE - Xóa tour
router.delete('/:id', tourController.deleteTour);

export default router;
