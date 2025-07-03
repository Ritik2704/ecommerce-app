import React, { useEffect, useState, useRef, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../hook/hook";
import { RootState } from "../store";
import { fetchAllProductsPaginated } from "../features/products/productThunks";
import ProductCard from "../components/ProductCard/ProductCard";
import { CircularProgress, Grid, Typography, Box } from "@mui/material";
import PaginationComponent from "../components/PaginationComponent/PaginationComponent";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 40;
const CHUNK_SIZE = 10;

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { products, loading, error, totalPages } = useAppSelector(
    (state: RootState) => state.products
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [renderedCount, setRenderedCount] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    dispatch(fetchAllProductsPaginated({ page: currentPage, size: PAGE_SIZE }));
    setRenderedCount(0);
  }, [currentPage, dispatch]);

  useEffect(() => {
    setRenderedCount(CHUNK_SIZE);
  }, [products]);

  useEffect(() => {
    if (error) {
      navigate("/error-fetch-prodcuts");
    }
  }, [error, navigate]);

  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setRenderedCount((prev) => {
            if (prev >= products.length) {
              return prev;
            }
            return Math.min(prev + CHUNK_SIZE, products.length);
          });
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, products.length]
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {t("HomePage.allProducts")}
      </Typography>
      <Grid container spacing={2}>
        {products.slice(0, renderedCount).map((product, index) => {
          if (index === renderedCount - 1) {
            return (
              <div key={product.id} ref={lastProductRef}>
                <ProductCard product={product} />
              </div>
            );
          }
          return (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          );
        })}
      </Grid>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 2 }} />
      )}
      {error && <Typography color="error">{error}</Typography>}

      <Box display="flex" justifyContent="center" mt={2}>
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </div>
  );
};

export default Home;
