import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";

interface OrderItem {
  productName: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number;
  createdAt: string;
  items: OrderItem[];
}

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/order");
        setOrders(res.data ?? []);
      } catch (err) {
        // Do not handle the exception here, interceptor will handle redirection
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto" }} />;
  }

  if (orders.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h5">You have no orders yet.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t("Order.myOrders")}
      </Typography>

      {orders.map((order, index) => {
        const total =
          order.items?.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ) ?? 0;

        return (
          <Card key={order.id} sx={{ my: 3, boxShadow: 3, color: "purple" }}>
            <CardContent>
              <Typography variant="h6" mb={1}>
                Order #{index + 1} -{" "}
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {order.items?.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                    paddingX: 1,
                    paddingY: 0.5,
                    borderRadius: 1,
                    backgroundColor: "background.paper",
                    boxShadow: 1,
                  }}
                >
                  <Typography noWrap sx={{ maxWidth: "70%" }}>
                    {item.productName} x {item.quantity}
                  </Typography>
                  <Typography fontWeight="bold" color="secondary">
                    ₹{item.price * item.quantity}
                  </Typography>
                </Box>
              ))}
              <Divider sx={{ mt: 2, mb: 1 }} />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingRight: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  Total: ₹{total}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default Orders;
