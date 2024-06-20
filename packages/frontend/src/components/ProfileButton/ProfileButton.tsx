import { Button, type ButtonProps, Spinner } from '@digdir/designsystemet-react';
import cx from 'classnames';

import { useTranslation } from 'react-i18next';
import styles from './profileButton.module.css';

interface ProfileButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const ProfileButton = (props: ProfileButtonProps) => {
  const { t } = useTranslation();
  const { className, isLoading, children, variant = 'primary', ...restProps } = props;
  const classes = cx(className, styles.profileButton, {
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
  });

  if (isLoading) {
    return (
      <Button className={classes} {...restProps} aria-disabled>
        <Spinner variant="interaction" title="loading" size="sm" />
        {t('word.loading')}
      </Button>
    );
  }

  return (
    <Button className={classes} {...restProps}>
      {children}
    </Button>
  );
};
