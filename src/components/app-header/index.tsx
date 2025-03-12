import { NavLink } from "react-router-dom";
import styles from "./index.module.css";
import { NavigationLink } from "./navigation-link";
import { Logo } from "@ya.praktikum/react-developer-burger-ui-components";

export function AppHeader() {
  return (
    <header className={styles.appHeader}>
      <nav className={styles.constructorIngredients}>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {({ isActive }) => (
            <NavigationLink
              text="Конструктор"
              active={isActive}
              icon="burger"
            />
          )}
        </NavLink>
      </nav>

      <nav className={styles.feed}>
        <NavLink
          to="/order-feed"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          {({ isActive }) => (
            <NavigationLink
              text="Лента заказов"
              active={isActive}
              icon="list"
            />
          )}
        </NavLink>
      </nav>

      <div className={styles.logo}>
        <Logo />
      </div>

      <NavLink
        to="/profile"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        {({ isActive }) => (
          <NavigationLink
            text="Личный кабинет"
            active={isActive}
            icon="profile"
          />
        )}
      </NavLink>
    </header>
  );
}
