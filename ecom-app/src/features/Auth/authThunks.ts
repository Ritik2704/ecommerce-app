import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (user: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", user);
      return response.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!err.response) {
        return rejectWithValue(
          "Cannot connect to server. Please try again later."
        );
      }
      const msg =
        err.response?.data?.message || "Login Failed!! \nInvalid credentials.";
      return rejectWithValue(msg);
    }
  }
);

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (
    user: { username: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/auth/signup", user);
      return response.data;
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!err.response) {
        return rejectWithValue(
          "Cannot connect to server. Please try again later."
        );
      }
      const msg =
        err.response?.data?.message || "Signup failed!! \nEmail already exists";
      return rejectWithValue(msg);
    }
  }
);
