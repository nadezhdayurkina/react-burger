import {
  Button,
  EmailInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { forgotPassword } from "../../utils/api";

export function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.page}>
      <form
        onSubmit={async (e: FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          // можно передать любой email, запрос отработает
          await forgotPassword(email);
          navigate(`/reset-password`, { state: { from: location.pathname } });
        }}
      >
        <div className={styles.container}>
          <h1 className="text_type_main-medium">Восстановление пароля</h1>
          <EmailInput
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            name={"email"}
            isIcon={false}
            placeholder={"Введите email"}
            autoComplete="email"
          />
          <Button htmlType="submit" type="primary" size="medium">
            Восстановить
          </Button>

          <div className="text_type_main-default mt-15 text_color_inactive">
            Вспомнили пароль? <Link to="/login">Войти </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
