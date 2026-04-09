import express from 'express';
import * as tourController from './tour.controller.js';

const router = express.Router();


router.get('/', tourController.getAllTours);


router.get('/search', tourController.searchTours);


router.get('/region/:region', tourController.getByRegion);


router.get('/duration/:days', tourController.getByDuration);


router.get('/:id', tourController.getTourById);


router.post('/', tourController.createTour);


router.patch('/:id', tourController.updateTour);


router.delete('/:id', tourController.deleteTour);

export default router;
