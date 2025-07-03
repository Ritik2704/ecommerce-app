import React, { useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const SessionExpired = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 10000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <Box
        textAlign="center"
        p={4}
        borderRadius={2}
        boxShadow={3}
        bgcolor="white"
        maxWidth="400px"
      >
        <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 2 }} />
        <Typography variant="h4" gutterBottom>
          Session Expired
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={3}>
          Your session has timed out for security reasons.
          <br />
          You will be redirected to the login page shortly.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate("/")}
        >
          Re-Login Now
        </Button>
      </Box>
    </Box>
  );
};

export default SessionExpired;
