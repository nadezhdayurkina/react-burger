import styles from "./index.module.css";
import { Info } from "./info";
import { useIngredientsStore } from "../../store";

export function IngredientDetails() {
  const ingredientsStore = useIngredientsStore();
  return (
    <div className={styles.modal}>
      <div className="text_type_main-large">Детали ингридиента</div>
      <div>
        <img
          src={ingredientsStore.currentIngredient?.image_large}
          alt={ingredientsStore.currentIngredient?.name}
        />
      </div>
      <div className="text_type_main-medium">
        {ingredientsStore.currentIngredient?.name}
      </div>
      <div className={styles.info}>
        <Info
          lable="Калории, ккал"
          value={ingredientsStore.currentIngredient?.calories}
        />
        <Info
          lable="Белки, г"
          value={ingredientsStore.currentIngredient?.proteins}
        />
        <Info lable="Жиры, г" value={ingredientsStore.currentIngredient?.fat} />
        <Info
          lable="Углеводы, г"
          value={ingredientsStore.currentIngredient?.carbohydrates}
        />
      </div>
    </div>
  );
}
