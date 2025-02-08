import clsx from "clsx";
import { BurgerConstructor } from "../burger-constructor";
import { BurgerIngredients } from "../burger-ingredients";
import styles from "./index.module.css";

export function LeftRight(props: { className?: string }) {
  return (
    <>
      <main className={clsx(styles.leftRight, props.className)}>
        <BurgerIngredients />
        <BurgerConstructor />
      </main>
    </>
  );
}
