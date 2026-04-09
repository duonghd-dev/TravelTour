import express from 'express';
import * as userController from './user.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import {
  authorizeAdmin,
  authorizeAdminOrStaff,
} from '../../common/middleware/authorization.middleware.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();




router.post('/verify-email', asyncHandler(userController.verifyEmailOTP));


router.use(authenticateToken);



router.get('/profile', asyncHandler(userController.getProfile));

router.put('/profile', asyncHandler(userController.updateProfile));



router.get('/support/admin', asyncHandler(userController.getAdminUser));



router.put('/password', asyncHandler(userController.updatePassword));

router.put(
  '/two-factor-auth',
  asyncHandler(userController.updateTwoFactorAuth)
);



router.get('/activity-log', asyncHandler(userController.getActivityLog));

router.get('/stats/overview', asyncHandler(userController.getUserStats));



router.get('/favorites', asyncHandler(userController.getFavorites));

router.post('/favorites', asyncHandler(userController.addFavorite));

router.delete('/favorites/:id', asyncHandler(userController.removeFavorite));



router.get(
  '/admin',
  authorizeAdminOrStaff,
  asyncHandler(userController.getAdminUser)
);


router.post('/', authorizeAdmin, asyncHandler(userController.createUser));


router.get(
  '/',
  authorizeAdminOrStaff,
  asyncHandler(userController.getAllUsers)
);


router.get('/:id', authorizeAdmin, asyncHandler(userController.getUserById));


router.put('/:id', authorizeAdmin, asyncHandler(userController.updateUserById));


router.delete('/:id', authorizeAdmin, asyncHandler(userController.deleteUser));

export default router;
