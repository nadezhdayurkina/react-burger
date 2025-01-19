import { CurrencyIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import clsx from "clsx";

export function CardIngredient(props: {
  name: string;
  image: string;
  price: number;
}) {
  return (
    <>
      <div className={styles.cardIngridient}>
        <img src={props.image}></img>
        <div className={clsx(styles.price, "text_type_digits-default")}>
          {props.price}
          <CurrencyIcon type="primary" className="m-1" />
        </div>
        <div className="text_type_main-default">{props.name}</div>
      </div>
    </>
  );
}
