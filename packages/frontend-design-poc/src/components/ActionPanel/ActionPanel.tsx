import { Button } from "@digdir/design-system-react";
import { XMarkIcon } from "@navikt/aksel-icons";
import styles from "./actionPanel.module.css";
import React from "react";
import { useTranslation } from "react-i18next";

interface ActionButton {
  label: string;
  icon: React.ReactElement;
  onClick?: () => void;
  disabled?: boolean;
  hidden?: boolean;
}

interface ActionPanelProps {
  actionButtons: ActionButton[];
  undoSelectOnClick?: () => void;
  elementsChosen?: number;
}

export function ActionPanel({
  actionButtons,
  undoSelectOnClick,
  elementsChosen = 0,
}: ActionPanelProps) {
  const { t } = useTranslation();
  return (
    <div className={styles.actionPanel}>
      <div className={styles.actionButtons}>
        {actionButtons
          .filter((actionBtn) => actionBtn.hidden !== true)
          .map(({ label, onClick, icon, disabled }) => {
            return (
              <Button
                className={styles.actionButton}
                key={label}
                onClick={onClick}
                disabled={disabled}
                variant="tertiary"
                size="small"
              >
                <span className={styles.actionButtonIcon}>{icon}</span>
                <span className={styles.actionButtonLabel}>{label}</span>
              </Button>
            );
          })}
      </div>
      {elementsChosen > 0 && (
        <div>
          <Button
            className={styles.undoButton}
            onClick={undoSelectOnClick}
            variant="tertiary"
            size="small"
          >
            <span className={styles.undoButtonLabel}>
              {t("actionPanel.chosen", { count: elementsChosen })}
            </span>
            <span className={styles.undoButtonIcon}>
              <XMarkIcon />
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
