import "./App.css";
import styles from "./App.module.css";
// подгружаем common.css из библиотеки ЯП - эти стили применяются к root, header и т.д.
// например, библиотека делает весь фон черным и меняет скроллы
import "@ya.praktikum/react-developer-burger-ui-components";
import { AppHeader } from "./components/app-header";
import { LeftRight } from "./components/left-right";
import axios from "axios";
import { useEffect, useState } from "react";
import { Ingredient } from "./components/burger-ingredients/ingredients-list";

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://norma.nomoreparties.space/api/ingredients")
      .then((resp) => {
        setIngredients(resp.data.data);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      {loading && (
        <div className="text_type_main-medium text_color_inactive">
          Данные загружаются...
        </div>
      )}
      {error && (
        <div className="text_type_main-medium text_color_inactive">
          Ошибка! Что-то пошло не так.
        </div>
      )}
      {!!ingredients?.length && (
        <LeftRight className={styles.leftRight} ingredients={ingredients} />
      )}
    </div>
  );
}

export default App;
