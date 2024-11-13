import { Button, Spinner } from '@digdir/designsystemet-react';
import type { GuiActionPriority } from 'bff-types-generated';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './guiActions.module.css';
export interface GuiActionProps {
  actions: GuiActionButtonProps[];
  dialogToken: string;
}

export interface GuiActionButtonProps {
  id: string;
  url: string;
  priority: GuiActionPriority;
  isDeleteAction: boolean;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'TRACE' | 'CONNECT';
  title: string;
  prompt?: string;
  disabled?: boolean;
}

interface GuiActionsProps {
  actions: GuiActionButtonProps;
  dialogToken: string;
}

/**
 * Handles the button click event based on HTTP method.
 *
 * @param {GuiActionButton} props - The properties passed to the button component.
 * @param dialogToken - The dialog token used for authorization.
 */
const handleButtonClick = async (props: GuiActionButtonProps, dialogToken: string, responseFinished: () => void) => {
  const { url, httpMethod, prompt } = props;

  if (prompt && !window.confirm(prompt)) {
    responseFinished();
    return;
  }

  if (httpMethod === 'GET') {
    responseFinished();
    window.open(url, '_blank');
  } else {
    try {
      const response = await fetch(url, {
        method: httpMethod,
        headers: {
          Authorization: `Bearer ${dialogToken}`,
        },
      });

      if (!response.ok) {
        console.error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error performing action:', error);
    } finally {
      responseFinished();
    }
  }
};

/**
 * Renders a single action button with the specified properties.
 *
 * @component
 * @param {GuiActionButton} props - The properties passed to the button component.
 * @returns {JSX.Element | null} The rendered button or null if hidden.
 */
const GuiActionButton = ({ actions, dialogToken }: GuiActionsProps): JSX.Element | null => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const { priority, id, title, disabled = false } = actions;
  const variant = priority.toLowerCase() as 'primary' | 'secondary' | 'tertiary';

  const responseCallback = () => {
    setIsLoading(false);
  };

  const handleClick = () => {
    setIsLoading(true);
    handleButtonClick(actions, dialogToken, responseCallback);
  };

  if (isLoading) {
    return (
      <Button id={id} variant={variant} disabled={true} aria-disabled>
        <Spinner title="loading" size="sm" />
        {t('word.loading')}
      </Button>
    );
  }

  return (
    <Button id={id} variant={variant} disabled={disabled} onClick={handleClick}>
      {title}
    </Button>
  );
};

/**
 * Renders a list of action buttons based on the provided actions array.
 *
 * @component
 * @param {GuiActionProps} props - The properties passed to the component.
 * @returns {JSX.Element} The container with all rendered action buttons.
 *
 * @example
 * <GuiActions
     onDeleteSuccess={() => console.log('Deleted')}
 *   actions={[
 *     { id: 'btn1', url: '/submit', disabled: false, priority: 'Primary', httpMethod: 'POST', title: 'Submit', dialogToken: 'token123' },
 *     { id: 'btn2', url: '/cancel', disabled: false, priority: 'Secondary', httpMethod: 'GET', title: 'Cancel', dialogToken: 'token123' },
 *   ]}
 *   dialogToken="your-dialog-token"
 * />
 */
export const GuiActions = ({ actions, dialogToken }: GuiActionProps): JSX.Element => {
  return (
    <section className={styles.guiActions} data-id="dialog-gui-actions">
      {actions.map((actionProps) => (
        <GuiActionButton key={actionProps.id} actions={actionProps} dialogToken={dialogToken} />
      ))}
    </section>
  );
};
