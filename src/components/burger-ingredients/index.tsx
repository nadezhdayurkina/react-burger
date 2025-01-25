import { IngredientsList, Ingredient } from "./ingredients-list";
import styles from "./index.module.css";
import { TabsHeader } from "./tabs-header";
import clsx from "clsx";

export function BurgerIngredients(props: {
  ingredients?: Ingredient[];
  onIngredientClick?: (ingredient: Ingredient) => void;
}) {
  return (
    <div className={styles.burgerIngredients}>
      <h1 className={clsx(styles.title, "text_type_main-large")}>
        Соберите бургер
      </h1>
      <TabsHeader />
      <IngredientsList
        ingredients={props.ingredients}
        onIngredientClick={props.onIngredientClick}
      />
    </div>
  );
}
