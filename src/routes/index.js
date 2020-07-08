import { Router } from 'express';

import employeeRoutes from './employees';
import managerRoutes from './managers';
import { auth } from '../middlewares';

const router = Router();

router.use('/managers', managerRoutes);
router.use('/employees', auth, employeeRoutes);

export default router;
