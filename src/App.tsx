import "./App.css";
import styles from "./App.module.css";
// подгружаем common.css из библиотеки ЯП - эти стили применяются к root, header и т.д.
// например, библиотека делает весь фон черным и меняет скроллы
import "@ya.praktikum/react-developer-burger-ui-components";
import { AppHeader } from "./components/app-header";
import { LeftRight } from "./components/left-right";
import { useEffect } from "react";
import { useIngredientsStore } from "./store";

function App() {
  const ingredientsStore = useIngredientsStore();

  useEffect(() => {
    ingredientsStore.fetchIngredients();
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {ingredientsStore.status == "loading" && (
        <div className="text_type_main-medium text_color_inactive">
          Данные загружаются...
        </div>
      )}
      {ingredientsStore.status == "failed" && (
        <div className="text_type_main-medium text_color_inactive">
          Ошибка! Что-то пошло не так.
        </div>
      )}
      {!!ingredientsStore.ingredients?.length && (
        <LeftRight className={styles.leftRight} />
      )}
    </div>
  );
}

export default App;
