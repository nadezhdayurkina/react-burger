import "./App.css";
import styles from "./App.module.css";
import "@ya.praktikum/react-developer-burger-ui-components";
import { AppHeader } from "./components/app-header";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { HomePage } from "./pages/home-page";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { ForgotPassword } from "./pages/forgot-password";
import { ResetPassword } from "./pages/reset-password";
import { Profile, ProfileInfo, Orders } from "./pages/profile";
import { useIngredientsStore, useUserStore } from "./store";
import { useEffect } from "react";
import { OnlyAuth, OnlyUnAuth } from "./components/protected-route";
import { Feed } from "./pages/feed";
import { Modal } from "./components/modal";
import { IngredientDetails } from "./components/ingredient-details";
import { OrderInfo } from "./pages/feed/order-info";

function App() {
  const userStore = useUserStore();
  const ingredientsStore = useIngredientsStore();

  useEffect(() => {
    userStore.authUser();
    ingredientsStore.loadIngredients();
  }, []);

  const navigate = useNavigate();

  let location = useLocation();

  const ingredientBackground =
    location.state && location.state.ingredientBackground;

  const backgroundPath = location.state?.backgroundPath;

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={ingredientBackground || backgroundPath || location}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/ingredients/:ingredientId"
          element={<IngredientDetails />}
        />

        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:id" element={<OrderInfo />} />

        <Route path="/profile" element={<OnlyAuth component={<Profile />} />}>
          <Route index element={<OnlyAuth component={<ProfileInfo />} />} />
          <Route path="orders" element={<OnlyAuth component={<Orders />} />} />
          <Route path="/profile/orders/:id" element={<OrderInfo />} />
        </Route>

        <Route
          path="/register"
          element={<OnlyUnAuth component={<Register />} />}
        />
        <Route path="/login" element={<OnlyUnAuth component={<Login />} />} />
        <Route
          path="/forgot-password"
          element={<OnlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path="/reset-password"
          element={
            <OnlyUnAuth
              component={<ResetPassword />}
              requiredReferrer="/forgot-password"
            />
          }
        />
      </Routes>

      {ingredientBackground && (
        <Routes>
          <Route
            path="/ingredients/:ingredientId"
            element={
              <Modal onClose={() => navigate(`/`)}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}

      {backgroundPath && (
        <Routes>
          <Route
            path="/feed/:id"
            element={
              <Modal onClose={() => navigate(`/feed`)}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path="profile/orders/:id"
            element={
              <Modal onClose={() => navigate(`/profile/orders`)}>
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
