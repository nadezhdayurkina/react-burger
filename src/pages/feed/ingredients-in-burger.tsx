import clsx from "clsx";
import { IngredientItem } from "../../store/slices/ingredients";
import styles from "./ingredients-in-burger.module.css";

export function IngredientsInBurger(props: {
  className?: string;
  ingredient?: IngredientItem;
  more?: number;
  width?: string;
}) {
  let width = props.width ?? "70px";

  if (!props.ingredient) return undefined;

  return (
    <div
      style={{ width }}
      className={clsx(styles.imageWrapper, props.className)}
    >
      <div className={styles.imageBorder}>
        <div className={styles.image}>
          <img
            src={props.ingredient?.image_mobile}
            width="78px"
            alt={props.ingredient?.name}
          />
          {!!props.more && (
            <div className={clsx(styles.more, "text_type_digits-default")}>
              +{props.more}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
