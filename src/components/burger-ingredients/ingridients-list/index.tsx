import { CardIngredient } from "../card-ingridient";
import styles from "./index.module.css";
import { ingridientsMock } from "../../../../utils/mock";
import { CardsHeader } from "../cards-header";
import { Counter } from "@ya.praktikum/react-developer-burger-ui-components";

export function IngredientsList() {
  return (
    <>
      <CardsHeader header="Булки" />
      <div className={styles.table}>
        {ingridientsMock
          .filter((item) => item.type == "bun")
          .map((item) => (
            <div className={styles.card}>
              {item._id == "60666c42cc7b410027a1a9b1" && (
                <Counter count={1} size="default" extraClass="m-1" />
              )}
              <CardIngredient
                key={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            </div>
          ))}
      </div>

      <CardsHeader header="Соусы" />
      <div className={styles.table}>
        {ingridientsMock
          .filter((item) => item.type == "sauce")
          .map((item) => (
            <div className={styles.card}>
              {item._id == "60666c42cc7b410027a1a9b9" && (
                <Counter count={1} size="default" extraClass="m-1" />
              )}
              <CardIngredient
                key={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            </div>
          ))}
      </div>

      <CardsHeader header="Начинки" />
      <div className={styles.table}>
        {ingridientsMock
          .filter((item) => item.type == "main")
          .map((item) => {
            return (
              <CardIngredient
                key={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            );
          })}
      </div>
    </>
  );
}
