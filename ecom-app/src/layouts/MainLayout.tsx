import Header from "../components/Header/Header";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

const MainLayout = () => {
  return (
    <>
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;
