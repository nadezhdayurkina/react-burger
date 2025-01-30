import { CardIngredient } from "../card-ingredient";
import styles from "./index.module.css";
import { CardsHeader } from "../cards-header";
import { Counter } from "@ya.praktikum/react-developer-burger-ui-components";
import { useState } from "react";
import { Modal } from "../../modal";
import { IngredientDetails } from "../../ingredient-details";

export type Ingredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

export function IngredientsList(props: {
  ingredients?: Ingredient[];
  onIngredientClick?: (ingredient: Ingredient) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>();
  if (!props.ingredients?.length) return <p>Нет данных.</p>;

  return (
    <div className={styles.ingredientsList}>
      {/* TODO: может  объединить в 1 компоненте */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <IngredientDetails currentIngredient={currentIngredient} />
        </Modal>
      )}

      <CardsHeader header="Булки" />
      <div className={styles.table}>
        {props.ingredients
          .filter((item) => item.type == "bun")
          .map((item) => (
            <div
              className={styles.card}
              key={item._id}
              onContextMenu={(e) => {
                props.onIngredientClick?.(item);
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={() => {
                setShowModal(true);
                setCurrentIngredient(item);
              }}
            >
              {item._id == "643d69a5c3f7b9001cfa093c" && (
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
        {props.ingredients
          .filter((item) => item.type == "sauce")
          .map((item) => (
            <div
              className={styles.card}
              key={item._id}
              onContextMenu={(e) => {
                props.onIngredientClick?.(item);
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={() => {
                setShowModal(true);
                setCurrentIngredient(item);
              }}
            >
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
        {props.ingredients
          .filter((item) => item.type == "main")
          .map((item) => (
            <div
              className={styles.card}
              key={item._id}
              onContextMenu={(e) => {
                props.onIngredientClick?.(item);
                e.stopPropagation();
                e.preventDefault();
              }}
              onClick={() => {
                setShowModal(true);
                setCurrentIngredient(item);
              }}
            >
              <CardIngredient
                key={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
