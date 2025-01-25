import styles from "./index.module.css";
import { NavigationLink } from "./navigation-link";
import { Logo } from "@ya.praktikum/react-developer-burger-ui-components";

export function AppHeader() {
  return (
    <header className={styles.appHeader}>
      <nav className={styles.constructorIngredients}>
        <NavigationLink text="Конструктор" active={true} icon="burger" />
      </nav>

      <nav className={styles.feed}>
        <NavigationLink text="Лента заказов" active={false} icon="list" />
      </nav>

      <div className={styles.logo}>
        <Logo />
      </div>

      <NavigationLink text="Личный кабинет" active={false} icon="profile" />
    </header>
  );
}
