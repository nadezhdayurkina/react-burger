import styles from "./index.module.css";
import { Info } from "./info";
import { useIngredientsStore } from "../../store";
import { useParams } from "react-router-dom";

export function IngredientDetails() {
  const { ingredientId } = useParams();
  const ingredientsStore = useIngredientsStore();

  const currentIngredient =
    ingredientsStore.ingredientsById?.[ingredientId?.toString() ?? ""];

  if (!currentIngredient)
    return <div className="text_type_main-medium">Ингредиент не найден</div>;

  return (
    <div className={styles.modal}>
      <div className="text_type_main-large">Детали ингридиента</div>
      <div>
        <img
          src={currentIngredient?.image_large}
          alt={currentIngredient?.name}
        />
      </div>
      <div className="text_type_main-medium">{currentIngredient?.name}</div>
      <div className={styles.info}>
        <Info lable="Калории, ккал" value={currentIngredient?.calories} />
        <Info lable="Белки, г" value={currentIngredient?.proteins} />
        <Info lable="Жиры, г" value={currentIngredient?.fat} />
        <Info lable="Углеводы, г" value={currentIngredient?.carbohydrates} />
      </div>
    </div>
  );
}
