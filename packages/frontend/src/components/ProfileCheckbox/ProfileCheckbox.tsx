import { Checkbox, type CheckboxProps } from '@digdir/designsystemet-react';
import cx from 'classnames';
import styles from './profileCheckbox.module.css';

type ProfileCheckbox = {} & CheckboxProps;

export const ProfileCheckbox = (props: ProfileCheckbox) => {
  const classes = cx(props.className, styles.profileCheckbox);
  return <Checkbox {...props} className={classes} />;
};
