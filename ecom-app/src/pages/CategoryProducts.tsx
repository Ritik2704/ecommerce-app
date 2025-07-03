import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hook/hook";
import { RootState } from "../store";
import { fetchProductsByCategoryPaginated } from "../features/products/productThunks";
import ProductCard from "../components/ProductCard/ProductCard";
import { CircularProgress, Grid, Typography, Box } from "@mui/material";
import PaginationComponent from "../components/PaginationComponent/PaginationComponent";

const PAGE_SIZE = 40;
const CHUNK_SIZE = 10;

const CategoryProducts: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const dispatch = useAppDispatch();

  const { products, loading, error, totalPages } = useAppSelector(
    (state: RootState) => state.products
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [renderedCount, setRenderedCount] = useState(0);

  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (category) {
      dispatch(
        fetchProductsByCategoryPaginated({
          category,
          page: currentPage,
          size: PAGE_SIZE,
        })
      );
      setRenderedCount(0);
    }
  }, [category, currentPage, dispatch]);

  useEffect(() => {
    setRenderedCount(CHUNK_SIZE);
  }, [products]);

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
        {category}
      </Typography>

      <Grid container spacing={2}>
        {products.slice(0, renderedCount).map((product, index) => {
          const productCard = <ProductCard product={product} />;

          if (index === renderedCount - 1) {
            return (
              <div key={product.id} ref={lastProductRef}>
                {productCard}
              </div>
            );
          }
          return <div key={product.id}>{productCard}</div>;
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

export default CategoryProducts;
