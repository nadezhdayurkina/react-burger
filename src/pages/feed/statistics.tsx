import clsx from "clsx";
import styles from "./statistics.module.css";
import { IngredientItem } from "../../store/slices/ingredients";

export function Statistics(props: {
  orders?: (
    | {
        ingredients: {
          ingredient: IngredientItem;
          count: any;
        }[];
        price: number;
        countOfIngredients: number;
        _id: string;
        status: "created" | "pending" | "done" | "cancelled";
        name: string;
        number: number;
        createdAt: string;
        updatedAt: string;
      }
    | undefined
  )[];
  total?: number;
  totalToday?: number;
}) {
  const ordersReady =
    props.orders
      ?.filter((order) => order?.status === "done")
      .map((o) => o?.number) ?? [];
  const ordersInProgress =
    props.orders
      ?.filter((order) => order?.status === "pending")
      .map((o) => o?.number) ?? [];

  return (
    <div className={styles.statistics}>
      <div className={styles.list}>
        <div className={clsx(styles.progress, "text_type_main-medium")}>
          <div className="mb-6">Готовы:</div>
          <div className={clsx(styles.progressColumns, "mb-6")}>
            <div className={styles.progressColumn}>
              {ordersReady
                ?.filter((_, index) => index < 10)
                .map((orderReady, index) => (
                  <div key={index} className={styles.orderReady}>
                    {orderReady}
                  </div>
                ))}
            </div>
            <div className={styles.progressColumn}>
              {ordersReady
                ?.filter((_, index) => index >= 10 && index < 20)
                .map((orderReady, index) => (
                  <div key={index} className={styles.orderReady}>
                    {orderReady}
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className={clsx(styles.progress, "text_type_main-medium")}>
          <div className="mb-6">В работе:</div>
          {ordersInProgress
            ?.filter((_, index) => index < 9)
            .map((orderInProgress, index) => (
              <div key={index} className={styles.orderInProgress}>
                {orderInProgress}
              </div>
            ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="text_type_main-medium mt-20">
          Выполнено за все время:
        </div>
        <div className="text_type_digits-large">{props.total}</div>
        <div className="text_type_main-medium">Выполнено за сегодня:</div>
        <div className="text_type_digits-large">{props.totalToday}</div>
      </div>
    </div>
  );
}
