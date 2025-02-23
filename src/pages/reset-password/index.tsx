import {
  Button,
  Input,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BASE_URL } from "../../utils/config";
import axios from "axios";

async function resetPassword(password: string, token: string) {
  const { data } = await axios.post(`${BASE_URL}/password-reset/reset`, {
    password,
    token,
  });
  return data as {
    success: boolean;
    message: string;
  };
}

export function ResetPassword() {
  const [password, setPassword] = useState("");
  const [passwordToken, setPasswordToken] = useState("");

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className="text_type_main-medium">Восстановление пароля</h1>
        <PasswordInput
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name={"password"}
          extraClass="mb-2"
        />
        <Input
          type={"text"}
          placeholder={"Введите код из письма"}
          onChange={(e) => setPasswordToken(e.target.value)}
          value={passwordToken}
          name={"name"}
          error={false}
          errorText={"Ошибка"}
          size={"default"}
          extraClass="ml-1"
        />
        <Button
          htmlType="button"
          type="primary"
          size="medium"
          onClick={() => resetPassword(password, passwordToken)}
        >
          Сохранить
        </Button>

        <div className="text_type_main-default mt-15 text_color_inactive">
          Вспомнили пароль? <Link to="/login">Войти </Link>
        </div>
      </div>
    </div>
  );
}
