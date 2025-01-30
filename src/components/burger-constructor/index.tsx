import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import clsx from "clsx";
import { Ingredient } from "../burger-ingredients/ingredients-list";
import { Modal } from "../modal";
import { useState } from "react";
import { OrderDetails } from "../order-details";

export function BurgerConstructor(props: {
  focusedBun: Ingredient | null;
  focusedIngredients: Ingredient[] | null;
}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className={styles.burgerConstructor}>
        {props.focusedBun && (
          <div className={styles.rowTopBottom}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={props.focusedBun.name}
              price={props.focusedBun.price}
              thumbnail={props.focusedBun.image}
            />
          </div>
        )}

        {props.focusedIngredients && (
          <div className={styles.rows}>
            {props.focusedIngredients.map((item) => (
              <div key={item._id} className={styles.rowContent}>
                <div className={styles.dragIcon}>
                  <DragIcon type="primary" />
                </div>
                <ConstructorElement
                  text={item.name}
                  price={item.price}
                  thumbnail={item.image}
                />
              </div>
            ))}
          </div>
        )}

        {props.focusedBun && (
          <div className={styles.rowTopBottom}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={props.focusedBun.name}
              price={props.focusedBun.price}
              thumbnail={props.focusedBun.image}
            />
          </div>
        )}
        <div>
          <div className={styles.bottom}>
            <div className={clsx(styles.totalPrice, "text_type_digits-medium")}>
              610
            </div>
            <div>
              <CurrencyIcon type="primary" className={styles.currencyIcon} />
            </div>
            <Button
              htmlType="button"
              type="primary"
              size="medium"
              onClick={() => setShowModal(true)}
            >
              Оформить заказ
            </Button>
            {showModal && (
              <Modal onClose={() => setShowModal(false)}>
                <OrderDetails />
              </Modal>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
