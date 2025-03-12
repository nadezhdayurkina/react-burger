import {
  Button,
  Input,
  PasswordInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { resetPassword } from "../../utils/api";

export function ResetPassword() {
  const [password, setPassword] = useState<string>("");
  const [passwordToken, setPasswordToken] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          let result = await resetPassword(password, passwordToken);
          if (result.success) {
            navigate(`/login`);
          }
        }}
      >
        <div className={styles.container}>
          <h1 className="text_type_main-medium">Восстановление пароля</h1>
          <PasswordInput
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            name={"password"}
            extraClass="mb-2"
            autoComplete="current-password"
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
            autoComplete="token"
          />
          <Button htmlType="submit" type="primary" size="medium">
            Сохранить
          </Button>

          <div className="text_type_main-default mt-15 text_color_inactive">
            Вспомнили пароль? <Link to="/login">Войти </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
