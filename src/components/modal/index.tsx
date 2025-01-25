import { ReactElement, useEffect, useRef } from "react";
import styles from "./index.module.css";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";

export function Modal(props: {
  children: ReactElement | ReactElement[];
  onClose?: () => void;
}) {
  let rootRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        props.onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [props.onClose]);

  return (
    <div
      className={styles.containerModal}
      ref={rootRef}
      onClick={(e) => {
        if (e.target == rootRef.current) props.onClose?.();
      }}
    >
      <div className={styles.modal}>
        {props.children}

        <div className={styles.closeIcon} onClick={() => props.onClose?.()}>
          <CloseIcon type="primary" />
        </div>
      </div>
    </div>
  );
}
