import type { Meta } from '@storybook/react';
import { PartyList } from 'frontend';
import { type PartyOptionGroup, getOptionsGroups } from 'frontend/src/components/PartyDropdown/mapToPartyOption.ts';
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
    isDeleted: false,
  },
  {
    party: 'urn:altinn:organization:identifier-no:1',
    partyType: 'Organization',
    name: 'Digitaliseringsdirektoratet',
    isCurrentEndUser: false,
    isDeleted: false,
    isAccessManager: true,
    isMainAdministrator: true,
  },
  {
    party: 'urn:altinn:organization:identifier-no:2',
    partyType: 'Organization',
    name: 'Testbedrift AS',
    isCurrentEndUser: false,
    isDeleted: false,
    isAccessManager: true,
    isMainAdministrator: true,
  },
  {
    party: 'urn:altinn:organization:identifier-no:3',
    partyType: 'Organization',
    name: 'Testdirektoratet AS',
    isCurrentEndUser: false,
    isDeleted: false,
    isAccessManager: true,
    isMainAdministrator: true,
  },
  {
    party: 'urn:altinn:organization:identifier-no:4',
    partyType: 'Organization',
    name: 'TestTestTest AS',
    isCurrentEndUser: false,
    isDeleted: false,
    isAccessManager: true,
    isMainAdministrator: true,
  },
];

export const SimpleExample = () => {
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const dialogsByView = {
    inbox: [],
    'saved-searches': [],
  };

  const optionsGroups: PartyOptionGroup = useMemo(() => getOptionsGroups(parties, dialogsByView, [], 'inbox'), []);

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
      isDeleted: false,
    },
    {
      party: 'urn:altinn:person:identifier-no:3',
      partyType: 'Person',
      name: 'My Loving Son',
      isCurrentEndUser: true,
      isDeleted: false,
    },
  ];

  const optionsGroups: PartyOptionGroup = getOptionsGroups(customParties, dialogsByView, [], 'inbox');

  return (
    <div style={{ width: 400 }}>
      <PartyList optionsGroups={optionsGroups} selectedPartyIds={selectedPartyIds} onSelect={setSelectedPartyIds} />
    </div>
  );
};

export const ExampleWithFilter = () => {
  const [selectedPartyIds, setSelectedPartyIds] = useState<string[]>([]);
  const dialogsByView = {
    inbox: [],
    'saved-searches': [],
  };
  const optionsGroups: PartyOptionGroup = useMemo(() => getOptionsGroups(parties, dialogsByView, [], 'inbox'), []);

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
