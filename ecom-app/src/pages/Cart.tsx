import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch, useAppSelector } from "../hook/hook";
import {
  fetchCart,
  addToCart,
  clearCartThunk,
  decreaseQuantity,
  clearCart,
} from "../features/cart/cartSlice";
import { placeOrder } from "../features/orders/orderThunks";
import { RootState } from "../store";
import { useTranslation } from "react-i18next";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const items = useSelector((state: RootState) => state.cart.items);
  const orderState = useAppSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => {
    if (!item.product) {
      return sum;
    }
    return sum + item.product.price * item.quantity;
  }, 0);

  const handleBuyNow = async () => {
    const result = await dispatch(placeOrder());
    if (placeOrder.fulfilled.match(result)) {
      dispatch(clearCart());
      navigate("/order-success");
    } else {
      alert("Failed to place order. Try again.");
    }
  };

  if (items.length === 0) {
    return (
      <Box textAlign="center" mt={4} sx={{
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
      > <Box component="img"
        src="/images/pngwing.com.png.crdownload"
        alt="Empty Cart"
        sx={{
          width: { xs: "200px", md: "500px" }
        }}></Box>
        <Typography variant="h5">{t("Cart.empty")}</Typography>
        <Typography variant="h5" gutterBottom>
          {t("Cart.Total")} {total}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("Cart.myCartItems")}
      </Typography>

      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        {items.map((item) =>
          item.product ? (
            <Card
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                p: 2,
                width: 550,
                height: 100,
              }}
            >
              <CardMedia
                component="img"
                image={item.product.imageUrl}
                alt={item.product.name}
                sx={{ width: 80, height: 80, objectFit: "contain", mr: 2 }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{item.product.name}</Typography>
                <Typography>Rs. {item.product.price}</Typography>
              </CardContent>
              <Box display="flex" alignItems="center" gap={1} pr={2}>
                <Button
                  variant="outlined"
                  onClick={() => dispatch(decreaseQuantity(item.id))}
                >
                  -
                </Button>
                <Typography>{item.quantity}</Typography>
                <Button
                  variant="outlined"
                  onClick={() => dispatch(addToCart(item.product.id))}
                >
                  +
                </Button>
              </Box>
            </Card>
          ) : null
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box textAlign="center">
        <Typography variant="h5" gutterBottom>
          {t("Cart.Total")} {total}
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} mt={2}>
          <Button
            variant="contained"
            color="warning"
            onClick={() => dispatch(clearCartThunk())}
          >
            {t("Cart.clearCart")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleBuyNow}
            disabled={orderState.loading}
          >
            {t("Cart.buyNow")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Cart;
