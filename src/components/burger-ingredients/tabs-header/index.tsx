import { Tab } from "@ya.praktikum/react-developer-burger-ui-components";
import "./index.css";
import styles from "./index.module.css";
import clsx from "clsx";

export function Tabs(props: {
  tabs: string[];
  active?: string | null;
  onActive?: (tab: string) => void;
}) {
  return (
    <div className={clsx(styles.tabs, "bddf82798f344c86a3296c2e684e779c")}>
      {props.tabs
        .filter((tab) => tab)
        .map((tab) => (
          <Tab
            key={tab}
            value={tab}
            active={tab == props.active}
            onClick={() => props.onActive?.(tab)}
          >
            {tab}
          </Tab>
        ))}
    </div>
  );
}
