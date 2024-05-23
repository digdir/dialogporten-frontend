import { Button } from '@digdir/designsystemet-react';
import { GuiActionPriority } from 'bff-types-generated';

import styles from './guiActions.module.css';

export interface GuiButtonProps {
  id: string;
  url: string;
  priority: GuiActionPriority;
  method: string;
  title: string;
  disabled?: boolean;
}
export interface GuiActionProps {
  actions: GuiButtonProps[];
}

/**
 * Renders a single action button with the specified properties.
 *
 * @component
 * @param {GuiButtonProps} props - The properties passed to the button component.
 * @param {string} props.id - The unique identifier for the button.
 * @param {string} props.url - The URL to which the form will be submitted.
 * @param {boolean} props.disabled - Determines if the button should be disabled.
 * @param {GuiActionPriority} props.priority - The priority of the action, which determines the button variant.
 * @param {string} props.method - The HTTP method to use when submitting the form (e.g., "POST").
 * @param {string} props.title - The text to display on the button.
 * @returns {JSX.Element | null} The rendered button or null if hidden.
 */
const GuiActionButton = ({
  priority,
  method,
  url,
  id,
  title,
  disabled = false,
}: GuiButtonProps): JSX.Element | null => {
  const variant = priority.toLowerCase() as 'primary' | 'secondary' | 'tertiary';
  return (
    <form id={id} action={url} method={method}>
      <Button type="submit" variant={variant} disabled={disabled}>
        {title}
      </Button>
    </form>
  );
};

/**
 * Renders a list of action buttons based on the provided actions array.
 *
 * @component
 * @param {GuiActionProps} props - The properties passed to the component.
 * @param {GuiButtonProps[]} props.actions - An array of action button properties.
 * @returns {JSX.Element} The container with all rendered action buttons.
 *
 * @example
 * <GuiActions
 *   actions={[
 *     { id: 'btn1', url: '/submit', disabled: false, priority: 'Primary', method: 'POST', title: 'Submit' },
 *     { id: 'btn2', url: '/cancel', disabled: false, priority: 'Secondary', method: 'GET', title: 'Cancel' },
 *   ]}
 * />
 */
export const GuiActions = ({ actions }: GuiActionProps): JSX.Element => {
  return (
    <section className={styles.guiActions}>
      {actions.map((buttonProps) => (
        <GuiActionButton key={buttonProps.id} {...buttonProps} />
      ))}
    </section>
  );
};
