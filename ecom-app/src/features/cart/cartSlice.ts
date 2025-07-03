import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

interface CartItemResponse {
  id: number;
  quantity: number;
  productId: number;
  productName: string;
  productPrice: number;
  productImageUrl: string;
}

interface CartState {
  items: CartItem[];
  loading: boolean;
}

const initialState: CartState = {
  items: [],
  loading: false,
};

// Thunks

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const res = await api.get("/cart");
  const transformed = res.data.map(
    (item: CartItemResponse): CartItem => ({
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        imageUrl: item.productImageUrl,
      },
    })
  );
  return transformed;
});

export const addToCart = createAsyncThunk(
  "cart/add",
  async (productId: number) => {
    const res = await api.post("/cart/add", { productId, quantity: 1 });
    const item = res.data;
    return {
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        imageUrl: item.productImageUrl,
      },
    };
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (cartItemId: number) => {
    const res = await api.put(`/cart/decrease/${cartItemId}`);
    if (!res.data) {
      return null;
    }
    const item = res.data;
    return {
      id: item.id,
      quantity: item.quantity,
      product: {
        id: item.productId,
        name: item.productName,
        price: item.productPrice,
        imageUrl: item.productImageUrl,
      },
    };
  }
);

export const clearCartThunk = createAsyncThunk("cart/clearAll", async () => {
  await api.delete("/cart/clear");
});

export const placeOrder = createAsyncThunk("cart/placeOrder", async () => {
  await api.post("/order/buy");
});

// Slice

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.items = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          const existing = state.items.find((i) => i.id === action.payload.id);
          if (existing) {
            existing.quantity = action.payload.quantity;
          } else {
            state.items.push(action.payload);
          }
        }
      )
      .addCase(
        decreaseQuantity.fulfilled,
        (
          state,
          action: PayloadAction<CartItem | null, string, { arg: number }>
        ) => {
          if (action.payload === null) {
            state.items = state.items.filter((i) => i.id !== action.meta.arg);
          } else {
            const existing = state.items.find(
              (i) => i.id === action.payload!.id
            );
            if (existing) {
              existing.quantity = action.payload.quantity;
            }
          }
        }
      )
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.items = [];
      })
      .addCase(placeOrder.fulfilled, (state) => {
        state.items = [];
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
