import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

interface PaginatedRequest {
  page: number;
  size: number;
}

interface CategoryPaginatedRequest extends PaginatedRequest {
  category: string;
}

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

interface PaginatedResponse {
  content: Product[];
  number: number;
  totalPages: number;
  last: boolean;
}

export const fetchProductsByCategoryPaginated = createAsyncThunk<
  PaginatedResponse,
  CategoryPaginatedRequest,
  { rejectValue: string }
>(
  "products/fetchByCategoryPaginated",
  async ({ category, page, size }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/products/${category}/page?page=${page}&size=${size}`
      );
      return response.data as PaginatedResponse;
    } catch (err) {
      return rejectWithValue("Failed to fetch products by category");
    }
  }
);

export const fetchAllProductsPaginated = createAsyncThunk<
  PaginatedResponse,
  PaginatedRequest,
  { rejectValue: string }
>("products/fetchAllPaginated", async ({ page, size }, { rejectWithValue }) => {
  try {
    const response = await api.get(`/products/page?page=${page}&size=${size}`);
    return response.data as PaginatedResponse;
  } catch (err) {
    return rejectWithValue(
      "We're having trouble loading products right now. Please try again later."
    );
  }
});
