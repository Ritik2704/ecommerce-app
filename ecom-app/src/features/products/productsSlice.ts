import { createSlice } from "@reduxjs/toolkit";
import {
  fetchAllProductsPaginated,
  fetchProductsByCategoryPaginated,
} from "./productThunks";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: {
    id: number;
    name: string;
  };
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  page: 0,
  totalPages: 0,
  hasMore: true,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    resetProducts(state) {
      state.products = [];
      state.page = 0;
      state.totalPages = 0;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategoryPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategoryPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content;
        state.page = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.hasMore = !action.payload.last;
      })
      .addCase(fetchProductsByCategoryPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load category products";
      })

      .addCase(fetchAllProductsPaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content;
        state.page = action.payload.number;
        state.totalPages = action.payload.totalPages;
        state.hasMore = !action.payload.last;
      })
      .addCase(fetchAllProductsPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load products";
      });
  },
});

export const { resetProducts } = productsSlice.actions;
export default productsSlice.reducer;
