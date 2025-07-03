import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import productsReducer from "../features/products/productsSlice";
import uiReducer from "../features/ui/uiSlice";
import cartReducer from "../features/cart/cartSlice";
import categoryReducer from "../features/category/categorySlice";
import orderReducer from "../features/orders/orderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
  ui: uiReducer,
  cart: cartReducer,
  categories: categoryReducer,
  order: orderReducer,
});

export default rootReducer;
