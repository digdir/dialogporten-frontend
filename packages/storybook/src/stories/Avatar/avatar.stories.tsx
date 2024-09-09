import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from 'frontend';
import contrast from 'get-contrast';

import { Switch, Textfield } from '@digdir/designsystemet-react';
import { fromStringToColor } from 'frontend/src/profile';
import { useMemo, useState } from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';

const meta = {
  title: 'Components/Avatar',
  component: Avatar,
  decorators: [
    withRouter,
    (Story) => {
      return (
        <div style={{ margin: 20 }}>
          <Story />
        </div>
      );
    },
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof Avatar>;

export const ImageURL: Story = {
  args: {
    profile: 'organization',
    name: 'NAV',
    imageUrl: 'https://altinncdn.no/orgs/nav/nav.png',
  },
};

export const ColorPlayground: StoryObj<typeof Avatar> = {
  render: (args) => {
    const [name, setName] = useState<string>(args.name);
    const [useAsCompanyName, setUseAsCompanyName] = useState<boolean>(false);

    const { contrastRatio, score } = useMemo(() => {
      const colorProfile = useAsCompanyName ? 'dark' : 'light';
      const { backgroundColor, foregroundColor } = fromStringToColor(name, colorProfile);
      const contrastRatio = Number.parseFloat(contrast.ratio(backgroundColor, foregroundColor)).toFixed(2);
      const score = contrast.score(backgroundColor, foregroundColor);
      return { contrastRatio, score };
    }, [name, useAsCompanyName]);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 25,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <Textfield
            type="text"
            label="Enter your name"
            placeholder={'Name'}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <Switch
            description=""
            position="left"
            size="md"
            checked={useAsCompanyName}
            onChange={() => {
              setUseAsCompanyName(!useAsCompanyName);
            }}
          >
            Is organization
          </Switch>
        </div>
        <h3>
          Score: {score}{' '}
          <span
            style={
              score !== 'Fail'
                ? { background: 'green', color: 'white', padding: 5 }
                : { background: 'red', color: 'white', padding: 5 }
            }
          >
            {contrastRatio}
          </span>
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            alignItems: 'center',
          }}
        >
          <h2>The avatar will look like this: </h2>
          <Avatar name={name} profile={useAsCompanyName ? 'organization' : 'person'} size="medium" />
          <Avatar name={name} profile={useAsCompanyName ? 'organization' : 'person'} size="small" />
        </div>
      </div>
    );
  },
  args: {
    name: 'John Doe',
    companyName: '',
  },
};
