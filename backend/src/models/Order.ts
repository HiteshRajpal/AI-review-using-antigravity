import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    size: string;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    mobileNumber: string;
    shippingAddress: string;
    customEngraving?: string;
    totalAmount: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
    createdAt: Date;
    updatedAt: Date;
}

const OrderItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
});

const OrderSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [OrderItemSchema],
        mobileNumber: { type: String, required: true },
        shippingAddress: { type: String, required: true },
        customEngraving: { type: String },
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ['Pending', 'Processing', 'Shipped', 'Delivered'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
