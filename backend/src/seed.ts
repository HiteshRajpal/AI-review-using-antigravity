import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product';
import connectDB from './config/db';

dotenv.config();

const products = [
    {
        name: 'Standard Plate',
        category: 'Plates',
        description: 'A modern, minimalist standard size plate. Perfect for all meals.',
        sizes: ['Standard'],
        price: 15.99,
        imageUrl: 'https://images.unsplash.com/photo-1610746979606-25e219ba3836?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Spoon Set',
        category: 'Spoons',
        description: 'Set of 3 sleek spoons: Small, Medium, and Large.',
        sizes: ['Small, Medium, Large Set'],
        price: 12.99,
        imageUrl: 'https://images.unsplash.com/photo-1616644026343-4f107f5979d3?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Minimalist Bowl',
        category: 'Bowls',
        description: 'Elegant bowl available in 8 incremental sizes for your perfect portion.',
        sizes: ['3"', '3.25"', '3.5"', '3.75"', '4"', '4.25"', '4.5"', '4.75"'],
        price: 10.99, // Base price
        imageUrl: 'https://images.unsplash.com/photo-1584346133934-a3afd2a33c4c?auto=format&fit=crop&q=80&w=600',
    },
    {
        name: 'Cover Lid',
        category: 'Cover Lids',
        description: 'Matching cover lids for our Minimalist Bowls. Available in 8 sizes.',
        sizes: ['3"', '3.25"', '3.5"', '3.75"', '4"', '4.25"', '4.5"', '4.75"'],
        price: 5.99, // Base price
        imageUrl: 'https://images.unsplash.com/photo-1594910123547-4180dcc113b2?auto=format&fit=crop&q=80&w=600', // placeholder lid
    },
    {
        name: 'Standard Glass',
        category: 'Glasses',
        description: 'A clean, simple standard drinking glass.',
        sizes: ['Standard'],
        price: 8.99,
        imageUrl: 'https://images.unsplash.com/photo-1549643594-5addcbe79730?auto=format&fit=crop&q=80&w=600',
    },
];

const seedDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kitchen-utensils';
        await mongoose.connect(mongoURI);
        console.log('MongoDB Connected for Seeding...');

        await Product.deleteMany({});
        console.log('Existing Products Removed.');

        await Product.insertMany(products);
        console.log('Products Inserted!');

        process.exit();
    } catch (err: any) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

seedDB();
