import { useFormik } from "formik";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "./authThunks";
import { AppDispatch } from "../../store";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const result = schema.safeParse(values);
      const errors: Record<string, string> = {};
      if (!result.success) {
        result.error.errors.forEach((err) => {
          const field = err.path[0];
          errors[field] = err.message;
        });
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        await dispatch(loginUser(values)).unwrap();
        navigate("/home");
      } catch (error) {
        if (typeof error === "string") {
          alert(error); // Will show error from thunk itself
        }
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "purple",
        p: 2,
      }}
    >
      <Card
        sx={{
          width: 400,
          boxShadow: 6,
          borderRadius: 4,
          p: 3,
          backgroundColor: "white",
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ fontWeight: 600, color: "#333" }}
          >
            Welcome Back
          </Typography>
          <form onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              type="email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              margin="normal"
              type="password"
              variant="outlined"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, py: 1.2, fontWeight: "bold", fontSize: "1rem" }}
            >
              Login
            </Button>
          </form>
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "text.secondary" }}
          >
            Don’t have an account?{" "}
            <MuiLink
              component={Link}
              to="/signup"
              underline="hover"
              color="secondary"
            >
              Sign up
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginForm;
