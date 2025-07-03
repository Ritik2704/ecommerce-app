import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Home,
  Category as CategoryIcon,
  ShoppingCart,
  ListAlt,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchCategories } from "../../features/category/categoryThunks";
import { Category } from "../../features/category/categorySlice";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.list);
  const [openCategories, setOpenCategories] = React.useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const toggleCategories = () => {
    setOpenCategories(!openCategories);
  };

  return (
    <List sx={{ width: 240 }}>
      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/home" onClick={onClose}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary={t("Sidebar.home")} />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding onClick={toggleCategories}>
        <ListItemButton>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={t("Sidebar.categories")} />
          {openCategories ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>

      <Collapse in={openCategories} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {categories.map((category: Category) => (
            <ListItem key={category.id} disablePadding sx={{ pl: 4 }}>
              <ListItemButton
                component={RouterLink}
                to={`/products/category/${category.name}`}
                onClick={onClose}
              >
                <ListItemText primary={category.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Collapse>

      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/cart" onClick={onClose}>
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText primary={t("Sidebar.cart")} />
        </ListItemButton>
      </ListItem>

      <ListItem disablePadding>
        <ListItemButton component={RouterLink} to="/order" onClick={onClose}>
          <ListItemIcon>
            <ListAlt />
          </ListItemIcon>
          <ListItemText primary={t("Sidebar.orders")} />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default Sidebar;
