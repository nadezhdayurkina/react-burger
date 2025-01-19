import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import { useState } from "react";
import "./index.css";

export function TabsHeader() {
  const [current, setCurrent] = useState("one");
  return (
    <div
      style={{ display: "flex" }}
      className="bddf82798f344c86a3296c2e684e779c"
    >
      <Tab value="one" active={current === "one"} onClick={setCurrent}>
        Булки
      </Tab>
      <Tab value="two" active={current === "two"} onClick={setCurrent}>
        Соусы
      </Tab>
      <Tab value="three" active={current === "three"} onClick={setCurrent}>
        Начинки
      </Tab>
    </div>
  );
}
