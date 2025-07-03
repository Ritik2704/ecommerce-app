import React from "react";
import { Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorFetchProductsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
    >
      <Typography variant="h5" gutterBottom color="error">
        Failed to load products. Please try again later.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/")}
        sx={{ mt: 2 }}
      >
        Go to Login
      </Button>
    </Box>
  );
};

export default ErrorFetchProductsPage;
