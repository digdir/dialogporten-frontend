import type { Meta } from '@storybook/react';
import { BottomDrawer, BottomDrawerContainer } from 'frontend';
import { useState } from 'react';

export default {
  title: 'Components/BottomDrawer/BottomDrawer',
  component: BottomDrawer,
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof BottomDrawer>;

export const Example = () => {
  const [exampleData, setExampleData] = useState(['Drawer 1', 'Drawer 2']);

  const addDrawer = () => {
    setExampleData((oldData) => [...oldData, `yet another drawer ${oldData.length + 1}`]);
  };

  return (
    <>
      <BottomDrawerContainer>
        <h2> BottomDrawer example </h2>
        <button type="button" onClick={addDrawer}>
          Add Drawer
        </button>

        {exampleData.map((text, i) => (
          <BottomDrawer key={i}>
            <div style={{ border: '1px solid black', padding: '4px', margin: '4px' }}>{text}</div>
          </BottomDrawer>
        ))}
      </BottomDrawerContainer>
    </>
  );
};
