import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    size: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
}

const initialState: CartState = {
    items: [],
    total: 0,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            const existingItem = state.items.find(
                (i) => i.productId === action.payload.productId && i.size === action.payload.size
            );
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        removeFromCart: (state, action: PayloadAction<{ productId: string; size: string }>) => {
            state.items = state.items.filter(
                (i) => !(i.productId === action.payload.productId && i.size === action.payload.size)
            );
            state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
