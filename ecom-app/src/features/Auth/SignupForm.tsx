import { useFormik } from "formik";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signupUser } from "./authThunks";
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

const schema = z
  .object({
    // username: z.string().min(2, "Username is required"),
    username: z.string().email("Invalid email"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  //This line is being added after username was changed to email.
  .refine((data) => data.username === data.email, {
    path: ["email"],
    message: "Email do not match",
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SignupForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
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
        await dispatch(
          signupUser({
            username: values.username,
            email: values.email,
            password: values.password,
          })
        ).unwrap();
        // alert('Signup successful!');
        navigate("/");
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
          width: 450,
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
            Create Account
          </Typography>
          <form onSubmit={formik.handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Email" //earlier it was username
              name="username"
              margin="normal"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <TextField
              fullWidth
              label="Confirm Email"
              name="email"
              margin="normal"
              type="email"
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
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              margin="normal"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.confirmPassword &&
                Boolean(formik.errors.confirmPassword)
              }
              helperText={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, py: 1.3, fontWeight: "bold", fontSize: "1rem" }}
            >
              Sign Up
            </Button>
          </form>
          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "text.secondary" }}
          >
            Already have an account?{" "}
            <MuiLink
              component={Link}
              to="/"
              underline="hover"
              color="secondary"
            >
              Login
            </MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SignupForm;
