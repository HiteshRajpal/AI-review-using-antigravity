import express, { Response } from 'express';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET current logged in user (verify route)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        res.json(req.user);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
