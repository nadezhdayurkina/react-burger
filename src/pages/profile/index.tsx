import clsx from "clsx";
import styles from "./index.module.css";
import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useUserStore } from "../../store";
import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

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
        <NavLink to="order-history">
          <div
            className={
              location.pathname === "/profile/order-history"
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

  const [name, setName] = useState(userStore.name);
  const [email, setEmail] = useState(userStore.email);
  const [password, setPassword] = useState("");

  return (
    <div className={styles.inputContainer}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const accessToken = localStorage.getItem("accessToken");
          userStore.updateInfoUser({
            accessToken,
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

export function OrderHistory() {
  return (
    <div className="text_type_main-medium">Здесь будет история заказов.</div>
  );
}
