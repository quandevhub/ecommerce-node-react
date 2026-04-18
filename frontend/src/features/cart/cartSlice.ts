import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../entities/types";

export type CartItem = Product  & {
  quantity: number;
};

const initialState: {items: CartItem[]} = {
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Product>) => {
            console.log(action.payload);
            const product = action.payload;
            const existingItem = state.items.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...product, quantity: 1 });
            }
        },
        deCreaseQuantity: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            
            const existingItem = state.items.find(item => item.id === productId);   
            if (existingItem) {
                if (existingItem.quantity > 1) {
                    existingItem.quantity -= 1;
                } else {
                    state.items = state.items.filter(item => item.id !== productId);
                }
            }
        },
        removeCartItem: (state, action: PayloadAction<number>) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.id !== productId);
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
})

export const { addToCart, deCreaseQuantity, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;