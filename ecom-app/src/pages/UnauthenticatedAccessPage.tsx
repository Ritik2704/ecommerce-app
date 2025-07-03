import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const UnauthenticatedAccess = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/");
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      bgcolor="#f8f8f8"
      textAlign="center"
      px={2}
    >
      <Typography variant="h4" gutterBottom color="error">
        Unauthorized Access
      </Typography>
      <Typography variant="subtitle1" mb={4}>
        You must be logged in to view this page.
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleLogin}>
        Go to Login
      </Button>
    </Box>
  );
};

export default UnauthenticatedAccess;
