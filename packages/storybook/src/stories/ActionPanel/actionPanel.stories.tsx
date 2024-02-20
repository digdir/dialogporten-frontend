import { ActionPanel } from "frontend-design-poc";
import { Meta, StoryObj } from "@storybook/react";
import {
  ArrowForwardIcon,
  ClockDashedIcon,
  EnvelopeOpenIcon,
  TrashIcon,
} from "@navikt/aksel-icons";

export default {
  title: "Components/ActionPanel",
  component: ActionPanel,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof ActionPanel>;

export const Default: StoryObj<typeof ActionPanel> = {
  args: {
    actionButtons: [
      {
        label: "Del",
        icon: <ArrowForwardIcon/>,
      },
      {
        label: "Markert som lest",
        icon: <EnvelopeOpenIcon />,
      },
      {
        label: "Flytt til arkiv",
        icon: <ClockDashedIcon />,
      },
      {
        label: "Slett",
        icon: <TrashIcon />,
      },
    ],
    elementsChosen: 3,
  },
};
