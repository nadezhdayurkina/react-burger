import { ReactElement, useEffect } from "react";
import styles from "./index.module.css";
import { CloseIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { ModalOverlay } from "../modal-overlay";

export function Modal(props: {
  children: ReactElement | (ReactElement | boolean)[] | boolean;
  onClose?: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") props.onClose?.();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <ModalOverlay onClose={() => props.onClose?.()}>
      <div className={styles.modalContent}>
        {props.children}
        <div
          data-cy="modal-close-icon"
          className={styles.closeIcon}
          onClick={() => props.onClose?.()}
        >
          <CloseIcon type="primary" />
        </div>
      </div>
    </ModalOverlay>
  );
}
