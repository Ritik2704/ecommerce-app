import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Select,
  MenuItem as SelectItem,
  Drawer,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Sidebar from "../Sidebar/Sidebar";
import { useTranslation } from "react-i18next";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { fetchCart } from "../../features/cart/cartSlice";
import { SelectChangeEvent } from "@mui/material/Select";

const Header = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const open = Boolean(anchorEl);
  const user = JSON.parse(localStorage.getItem("user_data") || "{}");

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    navigate("/");
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <>
      <AppBar position="sticky" color="secondary" sx={{ zIndex: 1200 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/home")}
            >
              ECOM
            </Typography>

            <Select
              value={i18n.language}
              onChange={handleLanguageChange}
              startAdornment={<LanguageIcon sx={{ mr: 1 }} />}
              size="small"
              sx={{
                color: "white",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white",
                },
              }}
            >
              <SelectItem value="en">EN</SelectItem>
              <SelectItem value="hi">हिन्दी</SelectItem>
            </Select>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <IconButton color="inherit" onClick={() => navigate("/cart")}>
              <Badge badgeContent={totalQuantity} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton onClick={handleAvatarClick}>
              <Avatar>{user?.username?.[0]}</Avatar>
            </IconButton>

            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem onClick={handleLogout}>{t("Header.logout")}</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
            top: 64,
            height: "calc(100% - 64px)",
          },
        }}
      >
        <Sidebar onClose={() => setDrawerOpen(false)} />
      </Drawer>
    </>
  );
};

export default Header;
