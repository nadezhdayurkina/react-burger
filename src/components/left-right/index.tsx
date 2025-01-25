import clsx from "clsx";
import { BurgerConstructor } from "../burger-constructor";
import { BurgerIngredients } from "../burger-ingredients";
import styles from "./index.module.css";
import { Ingredient } from "../burger-ingredients/ingredients-list";
import { useState } from "react";

export function LeftRight(props: {
  className?: string;
  ingredients?: Ingredient[];
}) {
  const [focusedBun, setFocusedBun] = useState<Ingredient | null>(null);

  const [focusedIngredients, setFocusedIngredients] = useState<Ingredient[]>(
    []
  );

  return (
    <main className={clsx(styles.leftRight, props.className)}>
      <BurgerIngredients
        ingredients={props.ingredients}
        onIngredientClick={(ingredient) => {
          if (ingredient.type == "bun") setFocusedBun(ingredient);
          else {
            setFocusedIngredients([...focusedIngredients, ingredient]);
          }
        }}
      />
      <BurgerConstructor
        focusedBun={focusedBun}
        focusedIngredients={focusedIngredients}
      />
    </main>
  );
}
