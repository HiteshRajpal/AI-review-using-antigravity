import express, { Response } from 'express';
import Order from '../models/Order';
import authMiddleware, { AuthRequest } from '../middleware/auth';

const router = express.Router();

// POST new order
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { items, mobileNumber, shippingAddress, customEngraving, totalAmount } = req.body;

        const newOrder = new Order({
            user: req.user.id, // from authMiddleware
            items,
            mobileNumber,
            shippingAddress,
            customEngraving,
            totalAmount,
        });

        const savedOrder = await newOrder.save();
        res.json(savedOrder);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET user orders
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
