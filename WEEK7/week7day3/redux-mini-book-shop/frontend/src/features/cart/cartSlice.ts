import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Product = {
  id: string;
  name: string;
  price: number;
};

export type CartItem = Product & {
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id,
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },

    increaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(
        (currentItem) => currentItem.id === action.payload,
      );
      if (item) item.quantity += 1;
    },

    decreaseQuantity(state, action: PayloadAction<string>) {
      const item = state.items.find(
        (currentItem) => currentItem.id === action.payload,
      );
      if (!item) return;

      if (item.quantity <= 1) {
        state.items = state.items.filter(
          (currentItem) => currentItem.id !== action.payload,
        );
      } else {
        item.quantity -= 1;
      }
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
