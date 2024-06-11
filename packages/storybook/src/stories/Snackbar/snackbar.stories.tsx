import { ArrowForwardIcon, ClockDashedIcon, EnvelopeOpenIcon, TrashIcon } from '@navikt/aksel-icons';
import { Meta } from '@storybook/react';
import { ActionPanel, BottomDrawerContainer } from 'frontend';
import { Snackbar } from 'frontend/src/components/Snackbar/Snackbar.tsx';
import { SnackbarDuration, SnackbarMessageVariant, useSnackbar } from 'frontend/src/components/Snackbar/useSnackbar.ts';
import { withRouter } from 'storybook-addon-react-router-v6';

export default {
  title: 'Components/BottomDrawer/Snackbar',
  component: Snackbar,
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
    docs: { source: { type: 'code' } },
  },
  decorators: [
    (Story) => (
      <BottomDrawerContainer>
        <Story />
      </BottomDrawerContainer>
    ),
  ],
} as Meta<typeof Snackbar>;

export const Example = () => {
  const { openSnackbar, dismissSnackbar, isOpen } = useSnackbar();

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() =>
          openSnackbar({
            message: 'I am non-dismissable',
            duration: SnackbarDuration.infinite,
            variant: 'error',
            dismissable: false,
          })
        }
      >
        Non-dismissable
      </button>
      {(['success', 'info', 'error'] as SnackbarMessageVariant[]).map((variant) => {
        return (
          <button
            key={variant}
            onClick={() =>
              openSnackbar({
                message: variant,
                variant,
                duration: SnackbarDuration.long,
              })
            }
          >
            Show {variant}
          </button>
        );
      })}
      {Object.values(SnackbarDuration).map((duration) => {
        return (
          <button
            key={duration}
            onClick={() =>
              openSnackbar({
                message: `Duration: ${duration}`,
                variant: 'success',
                duration: duration as SnackbarDuration,
              })
            }
          >
            {duration}
          </button>
        );
      })}
      <button onClick={() => dismissSnackbar()} style={{ marginLeft: 20 }}>
        Close all
      </button>
      {isOpen ? <p>Snackbar is open</p> : <p>Snackbar is closed</p>}
      <Snackbar />
    </div>
  );
};

export const SnackbarAndActionPanel = () => {
  const { openSnackbar, dismissSnackbar, isOpen } = useSnackbar();

  return (
    <div style={{ padding: 100 }}>
      {Object.values(SnackbarDuration).map((duration) => {
        return (
          <button
            key={duration}
            onClick={() =>
              openSnackbar({
                message: `Duration: ${duration}`,
                variant: 'success',
                duration: duration as SnackbarDuration,
              })
            }
          >
            {duration}
          </button>
        );
      })}
      <button onClick={() => dismissSnackbar()} style={{ marginLeft: 20 }}>
        Close all
      </button>
      {isOpen ? <p>Snackbar is open</p> : <p>Snackbar is closed</p>}
      <Snackbar />
      <ActionPanel
        actionButtons={[
          {
            label: 'Del',
            icon: <ArrowForwardIcon />,
          },
          {
            label: 'Markert som lest',
            icon: <EnvelopeOpenIcon />,
          },
          {
            label: 'Flytt til arkiv',
            icon: <ClockDashedIcon />,
          },
          {
            label: 'Slett',
            icon: <TrashIcon />,
          },
        ]}
        selectedItemCount={3}
      />
    </div>
  );
};
