import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./index.module.css";
import { Tabs } from "./tabs-header";
import clsx from "clsx";
import { useIngredientsStore } from "../../store";
import { CardsHeader } from "./cards-header";
import { CardIngredient } from "./card-ingredient";
import { Counter } from "@ya.praktikum/react-developer-burger-ui-components";
import { IngredientItem } from "../../store/slices/ingredients";
import { useDrag } from "react-dnd";
import { v4 as uuid4 } from "uuid";
import { Link, useLocation } from "react-router-dom";

function IngredientInTable(props: { item: IngredientItem; count?: number }) {
  const location = useLocation();
  const ingredientsStore = useIngredientsStore();

  const [, drag] = useDrag<IngredientItem>({
    type: "c71332a7-c027-4648-bebc-cf625b66d9d4",
    item: props.item,
  });
  return (
    <div
      ref={(node) => drag(node)}
      className={styles.card}
      key={props.item._id}
      onContextMenu={(e) => {
        if (props.item.type == "bun") {
          ingredientsStore.setBun({ ...props.item, uniqueId: uuid4() });
        } else {
          ingredientsStore.addFilling({ ...props.item, uniqueId: uuid4() });
        }
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {!!props.count && props.count > 0 && (
        <Counter count={props.count} size="default" extraClass="m-1" />
      )}

      <Link
        key={props.item._id}
        to={`/ingredients/${props.item._id}`}
        state={{ ingredientBackground: location }}
        className={styles.link}
      >
        <CardIngredient
          key={props.item._id}
          item={props.item}
          name={props.item.name}
          image={props.item.image}
          price={props.item.price}
        />
      </Link>
    </div>
  );
}

export function BurgerIngredients() {
  const ingredientsStore = useIngredientsStore();

  if (!ingredientsStore.ingredients?.length) return <p>Нет данных.</p>;

  const containerRef = useRef<HTMLDivElement>(null);
  const bunsRef = useRef<HTMLDivElement>(null);
  const saucesRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<string | null>(null);

  function sectionActive() {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight13 = containerRect.height / 3;

    if (bunsRef.current != null) {
      const bunsRect = bunsRef.current.getBoundingClientRect();
      const top = bunsRect.top - containerRect.top;
      if (top != null && top > 0 && top < containerHeight13) {
        setActiveTab("Булки");
        return;
      }
    }

    if (saucesRef.current != null) {
      const saucesRect = saucesRef.current.getBoundingClientRect();
      const top = saucesRect.top - containerRect.top;
      if (top != null && top > 0 && top < containerHeight13) {
        setActiveTab("Соусы");
        return;
      }
    }

    if (mainRef.current != null) {
      const mainRect = mainRef.current.getBoundingClientRect();
      const top = mainRect.top - containerRect.top;
      if (top != null && top > 0 && top < containerHeight13) {
        setActiveTab("Начинки");
        return;
      }
    }
  }

  useEffect(() => sectionActive(), []);

  const fillingCountById = useMemo(() => {
    const fillingCountById: { [id: string]: number } = {};
    ingredientsStore.filling?.forEach((it) => {
      if (!fillingCountById[it._id]) fillingCountById[it._id] = 0;
      fillingCountById[it._id] += 1;
    });

    return fillingCountById;
  }, [ingredientsStore.filling]);

  return (
    <div className={styles.burgerIngredients}>
      <h1 className={clsx(styles.title, "text_type_main-large")}>
        Соберите бургер
      </h1>
      <Tabs tabs={["Булки", "Соусы", "Начинки"]} active={activeTab} />
      <div
        className={styles.ingredientsList}
        ref={containerRef}
        onScroll={() => sectionActive()}
      >
        <div ref={bunsRef}>
          <CardsHeader header="Булки" />
        </div>
        <div className={styles.table}>
          {ingredientsStore.ingredients
            .filter((item) => item.type == "bun")
            .map((item) => (
              <IngredientInTable
                key={item._id}
                item={item}
                count={item._id === ingredientsStore.bun?._id ? 2 : 0}
              />
            ))}
        </div>

        <div ref={saucesRef}>
          <CardsHeader header="Соусы" />
        </div>
        <div className={styles.table}>
          {ingredientsStore.ingredients
            .filter((item) => item.type == "sauce")
            .map((item) => (
              <IngredientInTable
                key={item._id}
                item={item}
                count={fillingCountById[item._id]}
              />
            ))}
        </div>

        <div ref={mainRef}>
          <CardsHeader header="Начинки" />
        </div>
        <div className={styles.table}>
          {ingredientsStore.ingredients
            .filter((item) => item.type == "main")
            .map((item) => (
              <IngredientInTable
                key={item._id}
                item={item}
                count={fillingCountById[item._id]}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
