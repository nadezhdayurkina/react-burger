import styles from "./index.module.css";
import {
  Button,
  EmailInput,
} from "@ya.praktikum/react-developer-burger-ui-components";
import { useUserStore } from "../../store";
import { useState } from "react";

export function Profile() {
  const userStore = useUserStore();

  const [name, setName] = useState(userStore.name);
  const [email, setEmail] = useState(userStore.email);
  const [password, setPassword] = useState("");

  return (
    <div className={styles.inputContainer}>
      <EmailInput
        onChange={(e) => setName(e.target.value)}
        value={name}
        name={"login"}
        placeholder="Логин"
        isIcon={true}
        onBlur={() => {}}
      />
      <EmailInput
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        name={"email"}
        isIcon={true}
        onBlur={() => {}}
      />
      <EmailInput
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        name={"password"}
        placeholder="Пароль"
        isIcon={true}
        onBlur={() => {}}
      />

      <Button
        htmlType="button"
        type="primary"
        size="medium"
        onClick={() => {
          const accessToken = localStorage.getItem("accessToken");
          userStore.updateInfoUser({
            accessToken,
            email,
            password,
            name,
          });
        }}
      >
        Сохранить
      </Button>
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
    </div>
  );
}
