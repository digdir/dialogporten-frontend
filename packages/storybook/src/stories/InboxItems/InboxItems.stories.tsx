import type { Meta, StoryObj } from "@storybook/react";

import { InboxItems } from "../../../../frontend-design-poc/src/components/InboxItems";
import { InboxItem } from "../../../../frontend-design-poc/src/components/InboxItem";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Example/InboxItem",
  component: InboxItems,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  }, // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"], // More on argTypes: https://storybook.js.org/docs/api/argtypes
} satisfies Meta<typeof InboxItems>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const simpleExample: Story = {
  args: {
    children: [
      <InboxItem
        title="Tittel"
        description="Beskrivelse"
        sender={{
          label: "Avsender",
        }}
        receiver={{
          label: "Mottaker",
        }}
        toLabel="til"
        tags={[{ label: "hello" }, { label: "hallaz" }]}
      />,
      <InboxItem
        title="Tittel"
        description="Beskrivelse"
        sender={{
          label: "Avsender",
        }}
        receiver={{
          label: "Mottaker",
        }}
        toLabel="til"
        tags={[{ label: "hello" }, { label: "hallaz" }]}
      />,
    ],
  },
};
