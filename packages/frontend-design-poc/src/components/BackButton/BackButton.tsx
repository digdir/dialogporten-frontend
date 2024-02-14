import { Button } from "@digdir/design-system-react";
import { ArrowLeftIcon } from "@navikt/aksel-icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import styles from "./backButton.module.css";

export function BackButton({ pathTo }: { pathTo: string }) {
  const { t } = useTranslation();
  return (
    <Link to={pathTo} rel="noreferrer" className={styles.backLink}>
      <Button color="second" variant="tertiary" className={styles.backButton}>
        <ArrowLeftIcon className={styles.backIcon} />
        {t("word.back")}
      </Button>
    </Link>
  );
}
