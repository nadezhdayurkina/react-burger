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
import { Profile, ProfileInfo, OrderHistory } from "./pages/profile";
import { useIngredientsStore, useUserStore } from "./store";
import { useEffect } from "react";
import { OnlyAuth, OnlyUnAuth } from "./components/protected-route";
import { OrderFeed } from "./pages/order-feed";
import { Modal } from "./components/modal";
import { IngredientDetails } from "./components/ingredient-details";

function App() {
  const userStore = useUserStore();
  const ingredientsStore = useIngredientsStore();

  useEffect(() => {
    userStore.authUser();
    ingredientsStore.loadIngredients();
  }, []);

  const navigate = useNavigate();

  let location = useLocation();
  const background = location.state && location.state.background;

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/ingredients/:ingredientId"
          element={<IngredientDetails />}
        />

        <Route path="/profile/" element={<OnlyAuth component={<Profile />} />}>
          <Route index element={<OnlyAuth component={<ProfileInfo />} />} />
          <Route
            path="order-history"
            element={<OnlyAuth component={<OrderHistory />} />}
          />
        </Route>

        <Route path="/order-feed" element={<OrderFeed />} />
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
        <Route path="/profile/" element={<OnlyAuth component={<Profile />} />}>
          <Route index element={<OnlyAuth component={<ProfileInfo />} />} />
          <Route
            path="order-history"
            element={<OnlyAuth component={<OrderHistory />} />}
          />
        </Route>
      </Routes>

      {background && (
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
    </div>
  );
}

export default App;
