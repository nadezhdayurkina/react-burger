import {
  Button,
  EmailInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/config";
import { useState } from "react";

// TODO: вынести потом в api файл или удалить коммент
async function forgotPassword(email: string) {
  const { data } = await axios.post(`${BASE_URL}/password-reset`, { email });
  return data as {
    success: boolean;
    message: string;
  };
}

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.page}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          let result = await forgotPassword(email);
          // TODO: message еще надо показать если success == false
          if (result.success) {
            navigate(`/reset-password`, { state: { from: location.pathname } });
          }
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
