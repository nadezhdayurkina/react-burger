import { useEffect, useMemo } from "react";
import { useIngredientsStore, useOrdersWSStore } from "../../store";
import styles from "./index.module.css";
import { Statistics } from "./statistics";
import { Order } from "./order";

export function Feed() {
  let ingredientsStore = useIngredientsStore();

  let ordersWSStore = useOrdersWSStore();

  useEffect(() => {
    if (ordersWSStore.ordersWSPending == undefined)
      ordersWSStore.loadOrdersWS();

    if (ingredientsStore.ingredients == null) {
      ingredientsStore.loadIngredients();
    }
  }, []);

  let ordersWS = useMemo(() => {
    return ordersWSStore.orders.map((order) => {
      if (!order) return undefined;

      let countOfIngredients = order?.ingredients?.length;

      let map = new Map();
      order?.ingredients?.forEach((id) => {
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
        price: ingredients.reduce(
          (a, c) => a + c.count * c.ingredient.price,
          0
        ),
        countOfIngredients,
      };
    });
  }, [ordersWSStore.orders, ingredientsStore.ingredients]);

  let total = useMemo(() => {
    return ordersWSStore.total;
  }, [ordersWSStore.total]);

  let totalToday = useMemo(() => {
    return ordersWSStore.totalToday;
  }, [ordersWSStore.totalToday]);

  if (ordersWSStore.ordersWSPending) {
    return <div>Подключаемся к серверу заказов...</div>;
  }

  if (ordersWSStore.error) {
    return <div className="text-error">Ошибка: {ordersWSStore.error}</div>;
  }

  if (!ordersWSStore.socketConnected) {
    return <div>Соединение не установлено</div>;
  }

  if (ordersWSStore.orders.length === 0) {
    return <div>Пока нет заказов</div>;
  }

  return (
    <div>
      <div className="text_type_main-large mt-10">Лента заказов</div>
      <div className={styles.page}>
        <div className={styles.feed}>
          {ordersWS?.map((order) => (
            <Order
              key={order?._id}
              number={order?.number}
              date={order?.updatedAt}
              name={order?.name}
              ingredients={order?.ingredients}
              countOfIngredients={order?.countOfIngredients}
              price={order?.price}
              path="feed"
            />
          ))}
        </div>
        <Statistics orders={ordersWS} total={total} totalToday={totalToday} />
      </div>
    </div>
  );
}
