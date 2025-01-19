import clsx from "clsx";
import styles from "./index.module.css";
import { Icon, type IconName } from "./icon";

export function NavigationLink(props: {
  active?: boolean;
  text?: string;
  icon?: IconName;
}) {
  return (
    <div className={styles.appHeader}>
      <div
        className={clsx(
          styles.navLink,
          "text_type_main-default",
          props.active ? "text_color_primary" : "text_color_inactive"
        )}
      >
        {props.icon && (
          <Icon
            className={styles.icons}
            iconName={props.icon}
            type={props.active ? "primary" : "secondary"}
          />
        )}
        {props.text}
      </div>
    </div>
  );
}
