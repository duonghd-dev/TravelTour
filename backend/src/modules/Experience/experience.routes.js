import express from 'express';
import * as experienceController from './experience.controller.js';
import { authenticateToken } from '../../common/middleware/auth.middleware.js';
import asyncHandler from '../../common/utils/asyncHandler.js';

const router = express.Router();





router.get('/', asyncHandler(experienceController.getAllExperiences));


router.get('/:id', asyncHandler(experienceController.getExperienceDetail));



router.use(authenticateToken);


router.post('/', asyncHandler(experienceController.createExperience));


router.put('/:id', asyncHandler(experienceController.updateExperience));

export default router;
