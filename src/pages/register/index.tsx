import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useUserStore } from "../../store";
import { useState } from "react";

export function Register() {
  const userStore = useUserStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className={styles.page}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          userStore.requestUserRegistration({
            email,
            password,
            name,
          });
        }}
      >
        <div className={styles.container}>
          <h1 className="text_type_main-medium">Регистрация</h1>
          <Input
            type={"text"}
            placeholder={"имя"}
            onChange={(e) => setName(e.target.value)}
            value={name}
            name={"name"}
            autoComplete="username"
          />
          <EmailInput
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name={"email"}
            isIcon={false}
            autoComplete="email"
          />
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name={"password"}
            autoComplete="current-password"
          />

          <Button htmlType="submit" type="primary" size="medium">
            Зарегистрироваться
          </Button>

          <div className="text_type_main-default mt-15 text_color_inactive">
            Уже зарегистрированы? <Link to="/login">Войти </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
