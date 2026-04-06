import { tourService } from './tour.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

// 📖 Lấy tất cả tour
export const getAllTours = asyncHandler(async (req, res) => {
  const {
    search,
    region,
    location,
    minPrice,
    maxPrice,
    duration,
    page,
    limit,
  } = req.query;

  const tours = await tourService.getAllTours({
    search,
    region,
    location,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    duration: duration ? Number(duration) : undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  res.status(200).json({
    success: true,
    data: tours.data,
    pagination: tours.pagination,
  });
});

// 🔍 Lấy chi tiết 1 tour
export const getTourById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await tourService.getTourById(id);

  res.status(200).json({
    success: true,
    data: tour,
  });
});

// ➕ Tạo tour mới (admin)
export const createTour = asyncHandler(async (req, res) => {
  const tour = await tourService.createTour(req.body);

  res.status(201).json({
    success: true,
    data: tour,
    message: 'Tour created successfully',
  });
});

// ✏️ Cập nhật tour
export const updateTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const tour = await tourService.updateTour(id, req.body);

  res.status(200).json({
    success: true,
    data: tour,
    message: 'Tour updated successfully',
  });
});

// 🗑️ Xóa tour
export const deleteTour = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await tourService.deleteTour(id);

  res.status(200).json({
    success: true,
    message: 'Tour deleted successfully',
  });
});

// 🔎 Tìm kiếm tour
export const searchTours = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query required',
    });
  }

  const tours = await tourService.searchTours(q);

  res.status(200).json({
    success: true,
    data: tours,
  });
});

// 📊 Lấy tour theo region
export const getByRegion = asyncHandler(async (req, res) => {
  const { region } = req.params;
  const tours = await tourService.getByRegion(region);

  res.status(200).json({
    success: true,
    data: tours,
  });
});

// ⏱️ Lấy tour theo duration
export const getByDuration = asyncHandler(async (req, res) => {
  const { days } = req.params;
  const tours = await tourService.getByDuration(Number(days));

  res.status(200).json({
    success: true,
    data: tours,
  });
});
