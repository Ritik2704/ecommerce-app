import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import api from "../services/api";
import { useAppDispatch } from "../hook/hook";
import { addToCart } from "../features/cart/cartSlice";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const ProductDetails: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/id/${id}`);
        setProduct(response.data);
      } catch (err) {
        // console.error("Error fetching product details:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return <CircularProgress sx={{ display: "block", margin: "auto" }} />;
  }
  if (!product) {
    return <div style={{ textAlign: "center" }}>Product not found!</div>;
  }

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product.id));
    }
  };

  return (
    <Card sx={{ maxWidth: 600, margin: "auto", mt: 2 }}>
      <CardMedia
        component="img"
        height="400"
        image={product.imageUrl}
        alt={product.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.description}
        </Typography>
        <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
          Rs.{product.price.toFixed(2)}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Button
            onClick={handleAddToCart}
            variant="contained"
            color="secondary"
          >
            {t("ProductDetails.addToCart")}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductDetails;
