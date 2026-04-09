import express from 'express';
import * as artisanController from './artisan.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();





router.get('/', asyncHandler(artisanController.getAllArtisans));


router.get('/search', asyncHandler(artisanController.searchArtisans));


router.get('/:id', asyncHandler(artisanController.getArtisanDetail));


router.get('/:id/stats', asyncHandler(artisanController.getArtisanStats));



router.use(authenticateToken);


router.get('/me/profile', asyncHandler(artisanController.getMyArtisanProfile));


router.post(
  '/',
  asyncHandler((req, res, next) => {
    
    if (req.user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ nghệ nhân mới có thể tạo hồ sơ',
      });
    }
    next();
  }),
  asyncHandler(artisanController.createArtisanProfile)
);


router.put(
  '/',
  asyncHandler((req, res, next) => {
    
    if (req.user.role !== 'artisan') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ nghệ nhân mới có thể cập nhật hồ sơ',
      });
    }
    next();
  }),
  asyncHandler(artisanController.updateArtisanProfile)
);

export default router;
