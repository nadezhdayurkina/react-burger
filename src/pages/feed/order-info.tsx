import styles from "./order-info.module.css";
import clsx from "clsx";
import { OrderInfoIngredient } from "./order-info-ingredient";
import {
  CurrencyIcon,
  FormattedDate,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useParams } from "react-router-dom";
import { useIngredientsStore, useOrdersWSStore } from "../../store";
import { useEffect, useMemo } from "react";
import { IngredientItem } from "../../store/slices/ingredients";

export function OrderInfo() {
  const { id } = useParams();

  let ordersWSStore = useOrdersWSStore();

  let ingredientsStore = useIngredientsStore();
  useEffect(() => {
    if (ordersWSStore.ordersWSPending == null) ordersWSStore.loadOrdersWS();
    if (ingredientsStore.ingredients == null)
      ingredientsStore.loadIngredients();

    if (id !== undefined) {
      ingredientsStore.fetchOrderByNumber(id);
    }
  }, []);

  let order = useMemo(() => {
    let order = ingredientsStore.currentOrder?.data;

    let map = new Map();
    order?.ingredients?.forEach((id: string) => {
      if (!map.has(id)) map.set(id, 1);
      else map.set(id, map.get(id) + 1);
    });

    let ingredients = [];
    for (let id of map.keys()) {
      ingredients.push({
        ingredient: ingredientsStore.ingredientsById[id],
        count: map.get(id),
      });
    }

    return {
      ...order,
      ingredients,
      price: ingredients?.reduce(
        (a, c) => a + c.count * (c?.ingredient?.price ?? 0),
        0
      ),
    };
  }, [ingredientsStore.currentOrder?.data, ingredientsStore.ingredients]);

  return (
    <div className={styles.orderInfo}>
      {!order.name && (
        <div className={clsx("text_type_main-medium mb-3")}>
          Заказ не найден
        </div>
      )}
      {order.name && (
        <div className={styles.modal}>
          <div className={styles.orderNumber}>
            <div className={clsx("text_type_digits-default mb-10")}>#{id}</div>
          </div>

          <div className={clsx("text_type_main-medium mb-3")}>
            {order?.name}
          </div>
          <div
            className={clsx("text_type_main-small mb-15", styles.statusDone)}
          >
            {order?.status == "done" && "Выполнен"}
          </div>
          <div className={clsx("text_type_main-medium mb-6")}>Состав:</div>

          <div className={clsx("pr-6", styles.infoIngredients)}>
            {order?.ingredients.map(
              (
                i: {
                  ingredient: IngredientItem;
                  count: any;
                },
                index: number
              ) => (
                <OrderInfoIngredient
                  key={index}
                  className={"mb-4"}
                  ingredient={i.ingredient}
                  count={i.count}
                />
              )
            )}
          </div>

          <div className={clsx("mt-10", styles.bottom)}>
            <div className={clsx("text_type_main-default", styles.date)}>
              <FormattedDate date={new Date(order?.updatedAt as string)} />
            </div>
            <div
              className={clsx("text text_type_digits-default", styles.priceAll)}
            >
              {order?.price} <CurrencyIcon className="ml-1" type="primary" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
