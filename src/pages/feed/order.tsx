import clsx from "clsx";
import styles from "./order.module.css";
import { IngredientsInBurger } from "./ingredients-in-burger";
import { Link } from "react-router-dom";
import { IngredientItem } from "../../store/slices/ingredients";
import {
  CurrencyIcon,
  FormattedDate,
} from "@ya.praktikum/react-developer-burger-ui-components";

let INGREDIENTS_IN_BURGER_WIDTH = "48px";

export function Order(props: {
  number?: number;
  date?: string;
  name?: string;
  status?: "created" | "pending" | "done" | "cancelled";
  ingredients?: { ingredient: IngredientItem; count: any }[];
  countOfIngredients?: number;
  price?: number;
  path?: string;
}) {
  const leftoverIngredients =
    props.countOfIngredients !== undefined
      ? props.countOfIngredients - 6
      : undefined;

  return (
    <div>
      <Link
        to={`/${props.path}/${props.number}`}
        state={{
          backgroundType: props.path === "feed" ? "feed" : "profileOrders",
          backgroundPath: location.pathname,
        }}
      >
        <div className={clsx(styles.order, "m-1")}>
          <div
            className={clsx(
              styles.orderHeader,
              "text_type_main-small ml-1 mt-6"
            )}
          >
            <div className="text_type_digits-default ml-1 mt-6">
              #{props.number}
            </div>
            <div className={clsx("mr-4 mt-6", styles.date)}>
              <FormattedDate date={new Date(props.date as string)} />
            </div>
          </div>
          <div className="text_type_main-medium m-3">{props.name}</div>
          {props.status && (
            <div
              className={clsx("text_type_main-small ml-3 mb-6", styles.status)}
            >
              {props.status == "done" && "Выполнен"}
              {props.status == "pending" && "Готовится"}
              {props.status == "created" && "Создан"}
              {props.status == "cancelled" && "Отменён"}
            </div>
          )}
          <div className={clsx("mt-10 pb-6", styles.bottom)}>
            <div className={styles.images}>
              {props.ingredients
                ?.filter((_, index) => {
                  return index <= 5;
                })
                .map((i, index) => {
                  if (index <= 5) {
                    return (
                      <IngredientsInBurger
                        key={index}
                        width={INGREDIENTS_IN_BURGER_WIDTH}
                        ingredient={i.ingredient}
                        more={index === 5 ? leftoverIngredients : undefined}
                      />
                    );
                  }
                })}
            </div>

            <div
              className={clsx("text text_type_digits-default", styles.priceAll)}
            >
              {props.price}
              <CurrencyIcon className="ml-1 mr-4" type="primary" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
