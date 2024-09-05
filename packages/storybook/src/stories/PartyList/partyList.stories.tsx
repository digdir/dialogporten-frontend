import type { Meta } from '@storybook/react';
import { PartyList } from 'frontend';
import { type MergedPartyGroup, getOptionsGroups } from 'frontend/src/components/PartyDropdown/mergePartiesByName.ts';
import { useMemo, useState } from 'react';

export default {
  title: 'Components/PartyList',
  component: PartyList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 10 }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
} as Meta<typeof PartyList>;

const parties = [
  {
    party: 'urn:altinn:person:identifier-no:1',
    partyType: 'Person',
    name: 'Me Messon',
    isCurrentEndUser: true,
  },
  {
    party: 'urn:altinn:organization:identifier-no:1',
    partyType: 'Organization',
    name: 'Digitaliseringsdirektoratet',
    isCurrentEndUser: false,
  },
  {
    party: 'urn:altinn:organization:identifier-no:2',
    partyType: 'Organization',
    name: 'Testbedrift AS',
    isCurrentEndUser: false,
  },
  {
    party: 'urn:altinn:organization:identifier-no:3',
    partyType: 'Organization',
    name: 'Testdirektoratet AS',
    isCurrentEndUser: false,
  },
  {
    party: 'urn:altinn:organization:identifier-no:4',
    partyType: 'Organization',
    name: 'TestTestTest AS',
    isCurrentEndUser: false,
  },
];

export const SimpleExample = () => {
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const dialogsByView = {
    inbox: [],
    'saved-searches': [],
  };

  const optionsGroups: MergedPartyGroup = useMemo(
    () => getOptionsGroups(parties, dialogsByView, [], 'inbox'),
    [parties],
  );

  return (
    <div style={{ width: 400 }}>
      <PartyList optionsGroups={optionsGroups} onSelect={setSelectedPartyIds} selectedPartyIds={selectedPartyIds} />
    </div>
  );
};

export const MultiplePeople = () => {
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const dialogsByView = {
    inbox: [],
    'saved-searches': [],
  };

  const customParties = [
    ...parties,
    {
      party: 'urn:altinn:person:identifier-no:2',
      partyType: 'Person',
      name: 'My Loving Daughter',
      isCurrentEndUser: false,
    },
    {
      party: 'urn:altinn:person:identifier-no:3',
      partyType: 'Person',
      name: 'My Loving Son',
      isCurrentEndUser: false,
    },
  ];

  const optionsGroups: MergedPartyGroup = useMemo(
    () => getOptionsGroups(customParties, dialogsByView, [], 'inbox'),
    [customParties],
  );

  return (
    <div style={{ width: 400 }}>
      <PartyList
        optionsGroups={optionsGroups}
        selectedPartyIds={selectedPartyIds}
        setSelectedPartyIds={setSelectedPartyIds}
      />
    </div>
  );
};

export const ExampleWithFilter = () => {
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const dialogsByView = {
    inbox: [],
    'saved-searches': [],
  };
  const optionsGroups: MergedPartyGroup = useMemo(
    () => getOptionsGroups(parties, dialogsByView, [], 'inbox'),
    [parties],
  );

  return (
    <div style={{ width: 400 }}>
      <PartyList
        optionsGroups={optionsGroups}
        selectedPartyIds={selectedPartyIds}
        onSelect={setSelectedPartyIds}
        showSearchFilter
      />
    </div>
  );
};
