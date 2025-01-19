import styles from "./index.module.css";
import { NavigationLink } from "./navigation-link";
import { Logo } from "@ya.praktikum/react-developer-burger-ui-components";

export function AppHeader() {
  return (
    <div className={styles.appHeader}>
      <div style={{ marginRight: "8px" }}>
        <NavigationLink text="Конструктор" active={true} icon="burger" />
      </div>

      <div style={{ marginRight: "70px" }}>
        <NavigationLink text="Лента заказов" active={false} icon="list" />
      </div>

      <div style={{ marginRight: "270px" }}>
        <Logo />
      </div>

      <NavigationLink text="Личный кабинет" active={false} icon="profile" />
    </div>
  );
}
