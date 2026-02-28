import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    category: 'Plates' | 'Spoons' | 'Bowls' | 'Cover Lids' | 'Glasses';
    description: string;
    sizes: string[]; // E.g., ['Standard'] or ['3"', '3.25"', ...]
    price: number; // Base price
    imageUrl: string;
    inStock: boolean;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['Plates', 'Spoons', 'Bowls', 'Cover Lids', 'Glasses'],
        },
        description: { type: String, required: true },
        sizes: { type: [String], required: true },
        price: { type: Number, required: true },
        imageUrl: { type: String, default: '' },
        inStock: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
