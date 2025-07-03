import { useParams, useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

export default function ErrorPage() {
  const { code } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Error {code}
      </Typography>
      <Typography variant="body1" color="error" gutterBottom>
        Something went wrong. Try again later.
      </Typography>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => navigate("/")}
        style={{ marginTop: "20px" }}
      >
        Go to Login
      </Button>
    </div>
  );
}
