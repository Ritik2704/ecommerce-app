import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import MainLayout from "../layouts/MainLayout";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import Order from "../pages/Order";
import CategoryProducts from "../pages/CategoryProducts";
import OrderSuccess from "../pages/OrderSuccess";
import SessionExpired from "../pages/SessionExpired";
import PrivateRoute from "./PrivateRoute";
import UnauthenticatedAccessPage from "../pages/UnauthenticatedAccessPage";
import ErrorPage from "../pages/ErrorPage";
import ErrorFetchProductsPage from "../pages/ErrorFetchProductsPage";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/signup" element={<Signup />} />

    <Route element={<MainLayout />}>
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/product/:id"
        element={
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/cart"
        element={
          <PrivateRoute>
            <Cart />
          </PrivateRoute>
        }
      />
      <Route
        path="/order"
        element={
          <PrivateRoute>
            <Order />
          </PrivateRoute>
        }
      />
      <Route
        path="/products/category/:category"
        element={
          <PrivateRoute>
            <CategoryProducts />
          </PrivateRoute>
        }
      />
    </Route>
    <Route
      path="/order-success"
      element={
        <PrivateRoute>
          <OrderSuccess />
        </PrivateRoute>
      }
    />
    <Route path="/session-expired" element={<SessionExpired />} />
    <Route path="/unauthorized" element={<UnauthenticatedAccessPage />} />
    <Route path="/error/:code" element={<ErrorPage />} />
    <Route path="/error-fetch-prodcuts" element={<ErrorFetchProductsPage />} />
  </Routes>
);
export default AppRouter;
