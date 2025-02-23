import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import clsx from "clsx";
import { IngredientItem } from "../../../slices/ingredients";

export function CardIngredient(props: {
  item: IngredientItem;
  name: string;
  image: string;
  price: number;
}) {
  return (
    <div className={styles.cardIngredient}>
      <img src={props.image} alt={props.name}></img>
      <div className={clsx(styles.price, "text_type_digits-default")}>
        {props.price}
        <CurrencyIcon type="primary" className="m-1" />
      </div>
      <div className="text_type_main-default">{props.name}</div>
    </div>
  );
}
