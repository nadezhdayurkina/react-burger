import styles from "./index.module.css";
import donePng from "./done.png";
import clsx from "clsx";

export function OrderDetails() {
  return (
    <div className={styles.modal}>
      <div className="text text_type_digits-large">123345</div>
      <div className="text text_type_main-medium">идентификатор заказа</div>
      <img src={donePng} alt="галочка"></img>
      <div className="text text_type_main-small">Ваш заказ начали готовить</div>
      <div className={clsx("text_type_main-small", "text_color_inactive")}>
        Дождитесь готовности на орбитальной станции
      </div>
    </div>
  );
}
