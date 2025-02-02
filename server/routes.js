import express from 'express';

import authRoutes from './src/routes/authRoutes.js';
import taskRoutes from './src/routes/taskRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

const router = express.Router();

router.use('/server/', authRoutes);
router.use('/server/', userRoutes);
router.use('/server/', taskRoutes);

export default router;