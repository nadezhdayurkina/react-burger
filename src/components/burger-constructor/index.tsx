import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from "@ya.praktikum/react-developer-burger-ui-components";
import styles from "./index.module.css";
import clsx from "clsx";

export function BurgerConstructor() {
  let img = "https://code.s3.yandex.net/react/code/meat-04.png";
  return (
    <>
      <div
        className={styles.burgerConstructor}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          paddingLeft: "20px",
        }}
      >
        <div className={styles.rowTopBottom}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text="Краторная булка N-200i (верх)"
            price={200}
            thumbnail={img}
          />
        </div>
        <div className={styles.rows}>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Соус традиционный галактический"
              price={30}
              thumbnail={img}
            />
          </div>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Мясо бессмертных моллюсков Protostomia"
              price={300}
              thumbnail={img}
            />
          </div>

          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Плоды Фалленианского дерева"
              price={80}
              thumbnail={img}
            />
          </div>

          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Хрустящие минеральные кольца"
              price={80}
              thumbnail={img}
            />
          </div>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Хрустящие минеральные кольца"
              price={80}
              thumbnail={img}
            />
          </div>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Хрустящие минеральные кольца"
              price={80}
              thumbnail={img}
            />
          </div>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Хрустящие минеральные кольца"
              price={80}
              thumbnail={img}
            />
          </div>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Хрустящие минеральные кольца"
              price={80}
              thumbnail={img}
            />
          </div>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Хрустящие минеральные кольца"
              price={80}
              thumbnail={img}
            />
          </div>
          <div className={styles.rowContent}>
            <div style={{ paddingRight: "20px" }}>
              <DragIcon type="primary" />
            </div>
            <ConstructorElement
              text="Хрустящие минеральные кольца"
              price={80}
              thumbnail={img}
            />
          </div>
        </div>
        <div className={styles.rowTopBottom}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text="Краторная булка N-200i (низ)"
            price={200}
            thumbnail={img}
          />
        </div>
        <div>
          <div className={styles.bottom}>
            <div
              style={{ paddingRight: "10px" }}
              className="text_type_digits-medium"
            >
              610
            </div>
            <div style={{ paddingRight: "35px" }}>
              <CurrencyIcon type="primary" className={styles.currencyIcon} />
            </div>
            <Button htmlType="button" type="primary" size="medium">
              Оформить заказ
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
