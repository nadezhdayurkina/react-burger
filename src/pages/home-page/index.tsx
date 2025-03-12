import { useIngredientsStore } from "../../store";
import styles from "./index.module.css";
import { LeftRight } from "../../components/left-right";

export function HomePage() {
  const ingredientsStore = useIngredientsStore();

  return (
    <div className={styles.home}>
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
