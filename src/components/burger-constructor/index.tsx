import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import clsx from "clsx";
import { Modal } from "../modal";
import { useMemo } from "react";
import { OrderDetails } from "../order-details";
import { useIngredientsStore, useUserStore } from "../../store";
import { useDrag, useDrop } from "react-dnd";
import type {
  IngredientItem,
  IngredientItemInConstructor,
} from "../../store/slices/ingredients";
import { v4 as uuid4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Ingredient(props: {
  item: IngredientItemInConstructor;
  onMoved: (
    from: IngredientItemInConstructor,
    to: IngredientItemInConstructor
  ) => void;
  onDeleted: (item: IngredientItemInConstructor) => void;
}) {
  const [, drag] = useDrag<IngredientItemInConstructor>({
    type: "16190a86-1fd3-4389-9035-2833b3e11f9a",
    item: props.item,
  });

  const [, drop] = useDrop<IngredientItemInConstructor>({
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
      if (droppedItem.type == "bun") {
        ingredientsStore.setBun({ ...droppedItem, uniqueId: uuid4() });
      } else {
        ingredientsStore.addFilling({ ...droppedItem, uniqueId: uuid4() });
      }
    },
  });

  const ingredientsStore = useIngredientsStore();
  const userStore = useUserStore();
  const navigate = useNavigate();

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

  const deleteItem = (index: number) => {
    const newFilling = ingredientsStore.filling.filter((_, i) => index != i);
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
              text={ingredientsStore.bun.name + " (верх)"}
              price={ingredientsStore.bun.price}
              thumbnail={ingredientsStore.bun.image}
            />
          </div>
        )}

        {ingredientsStore.filling && (
          <div className={styles.rows}>
            {ingredientsStore.filling.map((item, index) => (
              <Ingredient
                key={item.uniqueId}
                item={item}
                onMoved={(from: IngredientItemInConstructor) => {
                  const indexTo = index;

                  const filling = ingredientsStore.filling.filter(
                    (it) => it.uniqueId != from.uniqueId
                  );
                  filling.splice(indexTo, 0, from);
                  ingredientsStore.setFilling(filling);
                }}
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
              text={ingredientsStore.bun.name + " (низ)"}
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
                if (!userStore.name) navigate(`/login`);
                if (ingredientsStore.bun?._id == null) return;

                const ingredientIds = [
                  ...ingredientsStore.filling.map((it) => it._id),
                  ingredientsStore.bun._id,
                  ingredientsStore.bun._id,
                ].filter((it) => it);

                if (userStore.name) ingredientsStore.makeOrder(ingredientIds);
              }}
            >
              Оформить заказ
            </Button>
            {(!!ingredientsStore.order || ingredientsStore.orderProcessing) && (
              <Modal
                onClose={() => {
                  ingredientsStore.clearOrder();
                  ingredientsStore.order = null;
                }}
              >
                {ingredientsStore.orderProcessing && (
                  <div className={styles.loaderContainer}>
                    <div className="text_type_main-medium">
                      заказ оформляется...
                    </div>
                    <div className={styles.loader}>
                      <div className={styles.face}>
                        <div className={styles.circle}></div>
                      </div>
                      <div className={styles.face}>
                        <div className={styles.circle}></div>
                      </div>
                    </div>
                  </div>
                )}
                {!!ingredientsStore.order && (
                  <OrderDetails order={ingredientsStore.order.number} />
                )}
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
