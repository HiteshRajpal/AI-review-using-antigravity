import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';

const router = express.Router();

const mockProducts = [
    {
        _id: "mock1",
        name: 'Standard Plate',
        category: 'Plates',
        description: 'A modern, minimalist standard size plate. Perfect for all meals.',
        sizes: ['Standard'],
        price: 15.99,
        imageUrl: 'https://images.unsplash.com/photo-1610746979606-25e219ba3836?auto=format&fit=crop&q=80&w=600',
    },
    {
        _id: "mock2",
        name: 'Minimalist Bowl',
        category: 'Bowls',
        description: 'Elegant bowl available in 8 incremental sizes for your perfect portion.',
        sizes: ['3"', '3.25"', '3.5"', '3.75"', '4"', '4.25"', '4.5"', '4.75"'],
        price: 10.99,
        imageUrl: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=600',
    }
];

// GET all products
router.get('/', async (req: Request, res: Response) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.log("Returning mock products since DB is offline.");
            res.json(mockProducts);
            return;
        }
        const products = await Product.find();
        res.json(products);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
