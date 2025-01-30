import { ReactElement, useRef } from "react";
import styles from "./index.module.css";

export function ModalOverlay(props: {
  children: ReactElement | ReactElement[];
  onClose?: () => void;
}) {
  const rootRef = useRef(null);

  return (
    <div
      className={styles.containerModal}
      ref={rootRef}
      onClick={(e) => {
        if (e.target == rootRef.current) props.onClose?.();
      }}
    >
      {props.children}
    </div>
  );
}
