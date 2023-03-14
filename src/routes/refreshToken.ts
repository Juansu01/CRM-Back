import { refreshTokenController } from '../controllers/refreshToken';
import { Router } from 'express';

const router = Router();

router.get('/token/refresh', refreshTokenController);

export default router;
