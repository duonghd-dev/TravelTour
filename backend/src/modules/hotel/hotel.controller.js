import { hotelService } from './hotel.service.js';
import asyncHandler from '../../common/utils/asyncHandler.js';


export const getAllHotels = asyncHandler(async (req, res) => {
  const { search, category, location, minPrice, maxPrice, page, limit } =
    req.query;

  const hotels = await hotelService.getAllHotels({
    search,
    category,
    location,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
  });

  res.status(200).json({
    success: true,
    data: hotels.data,
    pagination: hotels.pagination,
  });
});


export const getHotelById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotel = await hotelService.getHotelById(id);

  res.status(200).json({
    success: true,
    data: hotel,
  });
});


export const createHotel = asyncHandler(async (req, res) => {
  const hotel = await hotelService.createHotel(req.body);

  res.status(201).json({
    success: true,
    data: hotel,
    message: 'Hotel created successfully',
  });
});


export const updateHotel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const hotel = await hotelService.updateHotel(id, req.body);

  res.status(200).json({
    success: true,
    data: hotel,
    message: 'Hotel updated successfully',
  });
});


export const deleteHotel = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await hotelService.deleteHotel(id);

  res.status(200).json({
    success: true,
    message: 'Hotel deleted successfully',
  });
});


export const searchHotels = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query required',
    });
  }

  const hotels = await hotelService.searchHotels(q);

  res.status(200).json({
    success: true,
    data: hotels,
  });
});


export const getByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const hotels = await hotelService.getByCategory(category);

  res.status(200).json({
    success: true,
    data: hotels,
  });
});
