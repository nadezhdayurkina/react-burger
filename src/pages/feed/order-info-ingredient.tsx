import styles from "./order-info-ingredient.module.css";
import { IngredientsInBurger } from "./ingredients-in-burger";
import clsx from "clsx";
import { IngredientItem } from "../../store/slices/ingredients";
import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";

export function OrderInfoIngredient(props: {
  className?: string;
  ingredient?: IngredientItem;
  count?: number;
}) {
  if (!props.ingredient) return undefined;

  return (
    <div className={clsx(styles.ingredientRow, props.className)}>
      <IngredientsInBurger className={"mr-4"} ingredient={props.ingredient} />
      <div className={clsx("text_type_main-small mr-4")}>
        {props.ingredient?.name}
      </div>
      <div className={clsx("text text_type_digits-default", styles.price)}>
        {props.count} x {props.ingredient?.price}{" "}
        <CurrencyIcon className="ml-1" type="primary" />
      </div>
    </div>
  );
}
