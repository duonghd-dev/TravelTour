import express from 'express';
import * as aiController from './ai.controller.js';

const router = express.Router();


router.post('/suggest', aiController.getAISuggestion);


router.get('/health', aiController.checkAIHealth);

export default router;
