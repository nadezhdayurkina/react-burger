import { ReactElement, useRef } from "react";
import styles from "./index.module.css";

export function ModalOverlay(props: {
  children: ReactElement | ReactElement[];
  onClose?: () => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  return (
    <div
      data-cy="modal-overlay"
      className={styles.containerModal}
      ref={rootRef}
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target == rootRef.current) props.onClose?.();
      }}
    >
      {props.children}
    </div>
  );
}
