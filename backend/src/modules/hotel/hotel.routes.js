import express from 'express';
import * as hotelController from './hotel.controller.js';

const router = express.Router();


router.get('/', hotelController.getAllHotels);


router.get('/search', hotelController.searchHotels);


router.get('/category/:category', hotelController.getByCategory);


router.get('/:id', hotelController.getHotelById);


router.post('/', hotelController.createHotel);


router.patch('/:id', hotelController.updateHotel);


router.delete('/:id', hotelController.deleteHotel);

export default router;
