// import { createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../services/api";
// import { Order } from "./orderSlice";

// export const placeOrder = createAsyncThunk<Order>(
//   "order/placeOrder",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/order/buy");
//       return res.data;
//     } catch (error: any) {
//       console.error(
//         "Place order failed:",
//         error.response?.data || error.message
//       );
//       return rejectWithValue(error.response?.data || "Order failed");
//     }
//   }
// );

// export const fetchOrders = createAsyncThunk<Order[]>(
//   "order/fetchOrders",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/order");
//       return res.data;
//     } catch (error: any) {
//       console.error(
//         "Fetch orders failed:",
//         error.response?.data || error.message
//       );
//       return rejectWithValue(error.response?.data || "Fetching orders failed");
//     }
//   }
// );

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";
import { Order } from "./orderSlice";

export function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as { response?: { data?: string } };

    if (typeof err.response?.data === "string") {
      return err.response.data;
    }
  }

  return "Something went wrong";
}

export const placeOrder = createAsyncThunk<Order>(
  "order/placeOrder",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/order/buy");
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchOrders = createAsyncThunk<Order[]>(
  "order/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/order");
      return res.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
