import styles from "./index.module.css";
import { type Ingredient } from "../burger-ingredients/ingredients-list";
import { Info } from "./info";

export function IngredientDetails(props: { currentIngredient?: Ingredient }) {
  return (
    <div className={styles.modal}>
      <div className="text_type_main-large">Детали ингридиента</div>
      <div>
        <img
          src={props.currentIngredient?.image_large}
          alt={props.currentIngredient?.name}
        />
      </div>
      <div className="text_type_main-medium">
        {props.currentIngredient?.name}
      </div>
      <div className={styles.info}>
        <Info lable="Калории, ккал" value={props.currentIngredient?.calories} />
        <Info lable="Белки, г" value={props.currentIngredient?.proteins} />
        <Info lable="Жиры, г" value={props.currentIngredient?.fat} />
        <Info
          lable="Углеводы, г"
          value={props.currentIngredient?.carbohydrates}
        />
      </div>
    </div>
  );
}
