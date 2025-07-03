import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="80vh"
      textAlign="center"
      p={2}
    >
      <Typography variant="h4" gutterBottom color="success.main">
        🎉 Your order has been placed successfully!
      </Typography>
      <Typography variant="body1" mb={4}>
        Thank you for shopping with us.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/home")}
      >
        Go to Home
      </Button>
    </Box>
  );
};

export default OrderSuccess;
