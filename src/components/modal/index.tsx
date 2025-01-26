import { ReactElement, useEffect, useRef } from "react";
import styles from "./index.module.css";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { ModalOverlay } from "../modal-overlay";

export function Modal(props: {
  children: ReactElement | ReactElement[];
  onClose?: () => void;
}) {
  // const rootRef = useRef(null);

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
  }, []);

  return (
    <ModalOverlay onClose={() => props.onClose?.()}>
      <div className={styles.modalContent}>
        {props.children}
        <div className={styles.closeIcon} onClick={() => props.onClose?.()}>
          <CloseIcon type="primary" />
        </div>
      </div>
    </ModalOverlay>
  );
}
