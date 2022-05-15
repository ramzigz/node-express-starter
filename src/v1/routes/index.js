import express from 'express';
import usersRoutes from './users.routes.js';
import authRoutes from './auth.routes.js';

const router = express.Router();

router.use('/users', usersRoutes);
router.use('/', authRoutes);

export default router;
