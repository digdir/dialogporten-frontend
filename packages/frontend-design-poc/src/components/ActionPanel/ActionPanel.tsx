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
  onUndoSelection?: () => void;
  selectedItemCount?: number;
}

/**
 * Displays an action panel with a set of configurable action buttons and an optional undo button.
 *
 * @param {Object} props - The component props.
 * @param {ActionButton[]} props.actionButtons - An array of action buttons to display. Each button can contain a label, an icon, an onClick handler, and flags for disabled and hidden states.
 * @param {Function} [props.onUndoSelection] - An optional callback function that is called when the undo button is clicked.
 * @param {number} [props.selectedItemCount=0] - The number of items currently selected, used to determine if the undo button should be displayed.
 * @returns {React.ReactElement} The rendered action panel component.
 *
 * @example
 * <ActionPanel
 *   actionButtons={[{ label: 'Delete', icon: <DeleteIcon />, onClick: handleDelete }]}
 *   onUndoSelection={handleUndoSelection}
 *   selectedItemCount={2}
 * />
 */
export function ActionPanel({
  actionButtons,
  onUndoSelection,
  selectedItemCount = 0,
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
      {selectedItemCount > 0 && (
        <div>
          <Button
            className={styles.undoButton}
            onClick={onUndoSelection}
            variant="tertiary"
            size="small"
          >
            <span className={styles.undoButtonLabel}>
              {t("actionPanel.chosen", { count: selectedItemCount })}
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
