import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCategories } from "../../features/category/categoryThunks";
import { RootState, AppDispatch } from "../../store";
import { useNavigate } from "react-router-dom";
import { Category } from "../../features/category/categorySlice";

const SidebarCategoryList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { list: categories, loading } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="sidebar">
      <h3>Categories</h3>
      <ul>
        {categories.map((cat: Category) => (
          <li key={cat.id} onClick={() => navigate(`/category/${cat.name}`)}>
            {cat.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidebarCategoryList;
