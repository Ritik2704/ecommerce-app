import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const response = await api.get("/products/categories");
    return response.data;
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (categoryName: string) => {
    const response = await api.get(`/products/category/${categoryName}`);
    return response.data;
  }
);
