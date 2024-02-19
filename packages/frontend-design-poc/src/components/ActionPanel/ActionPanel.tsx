import { useTranslation } from "react-i18next";

import styles from "./actionPanel.module.css";

interface ActionPanelProps {
}

export function ActionPanel() {
  const { t } = useTranslation();
  return (
    <nav className={styles.actionPanel}>

    </nav>
  );
}
