import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import clsx from "clsx";
import { Modal } from "../modal";
import { useMemo, useState } from "react";
import { OrderDetails } from "../order-details";
import { useIngredientsStore } from "../../store";
import axios from "axios";
import { useDrag, useDrop } from "react-dnd";
import type { IngredientItem } from "../../slices/ingredients";

export type Order = {
  name: string;
  order: {
    number: number;
  };
  success: boolean;
} | null;

function Ingredient(props: {
  item: IngredientItem;
  onMoved: (from: IngredientItem, to: IngredientItem) => void;
  onDeleted: (item: IngredientItem) => void;
}) {
  const [, drag] = useDrag<IngredientItem>({
    type: "16190a86-1fd3-4389-9035-2833b3e11f9a",
    item: props.item,
  });

  const [, drop] = useDrop<IngredientItem>({
    accept: "16190a86-1fd3-4389-9035-2833b3e11f9a",
    drop: (droppedItem) => {
      props.onMoved(droppedItem, props.item);
    },
  });

  return (
    <div
      key={props.item._id}
      className={styles.rowContent}
      ref={(node) => drag(drop(node))}
    >
      <div className={styles.dragIcon}>
        <DragIcon type="primary" />
      </div>
      <ConstructorElement
        text={props.item.name}
        price={props.item.price}
        thumbnail={props.item.image}
        handleClose={() => {
          props.onDeleted(props.item);
        }}
      />
    </div>
  );
}

export function BurgerConstructor() {
  const [, drop] = useDrop<IngredientItem>({
    accept: "c71332a7-c027-4648-bebc-cf625b66d9d4",
    drop: (droppedItem: IngredientItem) => {
      if (droppedItem.type == "bun") ingredientsStore.setBun(droppedItem);
      else ingredientsStore.addFilling(droppedItem);
    },
  });

  const ingredientsStore = useIngredientsStore();

  const totalPrice = useMemo(() => {
    let price = 0;
    if (ingredientsStore.bun) {
      price = ingredientsStore.bun.price * 2;
    }

    ingredientsStore.filling?.forEach((item) => {
      price += item.price;
    });

    return price;
  }, [ingredientsStore.bun, ingredientsStore.filling]);

  const [order, setOrder] = useState<Order>(null);
  const [error, setError] = useState<boolean>(false);

  const ingredientIds = {
    ingredients: [...ingredientsStore.filling, ingredientsStore.bun]
      .map((item) => item?._id)
      .filter((id) => id != null),
  };

  const [makeOrderProcessing, setMakeOrderProcessing] =
    useState<boolean>(false);

  function makeOrder() {
    setMakeOrderProcessing(true);
    axios
      .post("https://norma.nomoreparties.space/api/orders", ingredientIds)
      .then((resp) => {
        setOrder(resp.data);
      })
      .catch(() => {
        setError(true);
        console.log("error", error);
      })
      .finally(() => {
        setMakeOrderProcessing(false);
      });
  }

  const move = (from: IngredientItem, to: IngredientItem) => {
    const ingredientFilling = ingredientsStore.filling.filter(
      (it) => it != from
    );

    if (
      ingredientFilling.findIndex((it) => it == to) >
      ingredientFilling.findIndex((it) => it == from)
    )
      ingredientFilling.splice(
        ingredientFilling.findIndex((it) => it == to) + 1,
        0,
        from
      );
    else
      ingredientFilling.splice(
        ingredientFilling.findIndex((it) => it == to),
        0,
        from
      );

    ingredientsStore.setFilling(ingredientFilling);
  };

  const deleteItem = (ind: number) => {
    const newFilling = ingredientsStore.filling.filter(
      (it, index) => index != ind
    );
    ingredientsStore.setFilling(newFilling);
  };

  return (
    <>
      <div className={styles.burgerConstructor} ref={(node) => drop(node)}>
        {ingredientsStore.bun && (
          <div className={styles.rowTopBottom}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={ingredientsStore.bun.name}
              price={ingredientsStore.bun.price}
              thumbnail={ingredientsStore.bun.image}
            />
          </div>
        )}

        {ingredientsStore.filling && (
          <div className={styles.rows}>
            {ingredientsStore.filling.map((item, index) => (
              <Ingredient
                item={item}
                onMoved={move}
                onDeleted={() => {
                  deleteItem(index);
                }}
              />
            ))}
          </div>
        )}

        {ingredientsStore.bun && (
          <div className={styles.rowTopBottom}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={ingredientsStore.bun.name}
              price={ingredientsStore.bun.price}
              thumbnail={ingredientsStore.bun.image}
            />
          </div>
        )}
        <div>
          <div className={styles.bottom}>
            <div className={clsx(styles.totalPrice, "text_type_digits-medium")}>
              {totalPrice}
            </div>
            <div>
              <CurrencyIcon type="primary" className={styles.currencyIcon} />
            </div>
            <Button
              htmlType="button"
              type="primary"
              size="medium"
              onClick={() => {
                makeOrder();
              }}
            >
              Оформить заказ
            </Button>
            {(!!order || makeOrderProcessing) && (
              <Modal
                onClose={() => {
                  setOrder(null);
                  ingredientsStore.clearOrder();
                }}
              >
                {makeOrderProcessing && (
                  <div className={styles.loader}>заказ оформляется..</div>
                )}
                {!!order && <OrderDetails order={order.order.number} />}
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
