import {
  Button,
  EmailInput,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../../store";
import { useState } from "react";

export function Login() {
  const userStore = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  console.log("render", userStore.email);
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className="text_type_main-medium">Вход</h1>
        <EmailInput
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name={"email"}
          isIcon={false}
        />
        <PasswordInput
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name={"password"}
          extraClass="mb-2"
        />
        <Button
          htmlType="button"
          type="primary"
          size="medium"
          onClick={async () => {
            let result = await userStore.loginUser({
              email,
              password,
            });

            if (result.payload.success == true) {
              navigate(`/`);
            }
          }}
        >
          Войти
        </Button>

        <div className="text_type_main-default mt-15 text_color_inactive">
          Вы — новый пользователь?{" "}
          <Link to="/register">Зарегистрироваться </Link>
        </div>
        <div className="text_type_main-default mt-4 text_color_inactive">
          Забыли пароль? <Link to="/forgot-password">Восстановить пароль </Link>
        </div>
      </div>
    </div>
  );
}
