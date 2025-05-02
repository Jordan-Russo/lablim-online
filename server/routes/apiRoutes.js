import express from 'express';
const router = express.Router();
import supabaseController from '../controllers/supabase.js';

router.get('/grabIncomingOrders/:id', supabaseController.grabIncomingOrders);
router.get('/grabTestReport/:id', supabaseController.grabTestReport);
// name, new order, new organization, get order...

export default router;