import { Button, type ButtonProps } from '@digdir/designsystemet-react';
import cx from 'classnames';

import styles from './profileButton.module.css';

export const ProfileButton = (props: ButtonProps) => {
  const { className, variant = 'primary', ...restProps } = props;
  const classes = cx(className, styles.profileButton, {
    [styles.primary]: variant === 'primary',
    [styles.secondary]: variant === 'secondary',
    [styles.tertiary]: variant === 'tertiary',
  });
  return <Button className={classes} {...restProps} />;
};
