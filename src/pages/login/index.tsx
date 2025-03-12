import {
  Button,
  EmailInput,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store";
import { useState } from "react";

export function Login() {
  const userStore = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.page}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          userStore.loginUser({
            email,
            password,
          });
        }}
      >
        <div className={styles.container}>
          <h1 className="text_type_main-medium">Вход</h1>

          <EmailInput
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name="email"
            isIcon={false}
            autoComplete="email"
          />
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name="password"
            extraClass="mb-2"
            autoComplete="current-password"
          />

          <Button htmlType="submit" type="primary" size="medium">
            Войти
          </Button>
          <div className="text_type_main-default mt-15 text_color_inactive">
            Вы — новый пользователь?{" "}
            <Link to="/register">Зарегистрироваться </Link>
          </div>
          <div className="text_type_main-default mt-4 text_color_inactive">
            Забыли пароль?{" "}
            <Link to="/forgot-password">Восстановить пароль </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
