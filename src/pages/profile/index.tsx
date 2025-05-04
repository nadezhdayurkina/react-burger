import clsx from "clsx";
import styles from "./index.module.css";
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import {
  useIngredientsStore,
  useUserOrdersStore,
  useUserStore,
} from "../../store";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Order } from "../feed/order";

export function Profile() {
  const userStore = useUserStore();
  const location = useLocation();

  return (
    <div className={styles.page}>
      <div className={clsx(styles.navigationBar, "text_type_main-medium")}>
        <NavLink to="/profile">
          <div
            className={
              location.pathname == "/profile"
                ? "text_color_primary"
                : "text_color_inactive"
            }
          >
            Профиль
          </div>
        </NavLink>
        <NavLink to="orders">
          <div
            className={
              location.pathname === "/profile/orders"
                ? "text_color_primary"
                : "text_color_inactive"
            }
          >
            История заказов
          </div>
        </NavLink>

        <div
          className={clsx(styles.logOut, "text_color_inactive")}
          onClick={async () => userStore.logOut()}
        >
          Выход
        </div>
        <div className="text_type_main-small text_color_inactive mt-15">
          В этом разделе вы можете <br />
          изменить свои персональные данные
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export function ProfileInfo() {
  const userStore = useUserStore();

  const [name, setName] = useState<string>(userStore.name);
  const [email, setEmail] = useState<string>(userStore.email);
  const [password, setPassword] = useState<string>("");

  return (
    <div className={styles.inputContainer}>
      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          userStore.updateInfoUser({
            email,
            password,
            name,
          });
        }}
      >
        <Input
          placeholder={"Логин"}
          onChange={(e) => setName(e.target.value)}
          value={name}
          name={"name"}
          extraClass="mb-3"
          onBlur={() => {}}
          icon="EditIcon"
        />

        <EmailInput
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name={"email"}
          extraClass="mb-3"
          isIcon={true}
          onBlur={() => {}}
          autoComplete="username"
        />

        <PasswordInput
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name={"password"}
          extraClass="mb-3"
          icon="EditIcon"
          placeholder="Пароль"
          onBlur={() => {}}
          autoComplete="current-password"
        />
        <Button
          htmlType="button"
          type="secondary"
          size="medium"
          onClick={() => {
            setName(userStore.name);
            setEmail(userStore.email);
            setPassword("");
          }}
        >
          Отмена
        </Button>
        <Button htmlType="submit" type="primary" size="medium">
          Сохранить
        </Button>
      </form>
    </div>
  );
}

export function Orders() {
  let useUserOrders = useUserOrdersStore();
  let ingredientsStore = useIngredientsStore();

  useEffect(() => {
    useUserOrders.connectUserOrders();

    if (ingredientsStore.ingredients == null)
      ingredientsStore.loadIngredients();
  }, []);

  let orders = useMemo(() => {
    return useUserOrders.userOrders?.map((order) => {
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
  }, [useUserOrders.userOrders, ingredientsStore.ingredients]);

  if (useUserOrders.userOrdersPending) {
    return <div>Подключаемся к серверу заказов...</div>;
  }

  if (useUserOrders.error) {
    return <div className="text-error">Ошибка: {useUserOrders.error}</div>;
  }

  if (useUserOrders.userOrders.length === 0) {
    return <div>У вас пока нет заказов</div>;
  }

  return (
    <div className={styles.feed}>
      {orders.map((order) => (
        <Order
          key={order?._id}
          number={order?.number}
          date={order?.updatedAt}
          name={order?.name}
          status={order?.status}
          ingredients={order?.ingredients}
          countOfIngredients={order?.countOfIngredients}
          price={order?.price}
          path="profile/orders"
        />
      ))}
    </div>
  );
}
