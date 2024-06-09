import { Meta, StoryObj } from '@storybook/react';
import { Filter, FilterBar } from 'frontend';
import { CustomFilterValueType, FilterSetting } from 'frontend/src/components/FilterBar/FilterBar.tsx';
import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';

type Person = {
  id: string;
  name: string;
  country: string;
  gender: 'Male' | 'Female';
  yearOfBirth: number;
};

type Document = {
  id: string;
  created: string;
  title: string;
};

const importantDocs: Document[] = [
  {
    id: '1',
    created: new Date(new Date().getTime() - 48 * 60 * 60 * 1000).toISOString(),
    title: 'Important Document 1',
  },
  {
    id: '2',
    created: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
    title: 'Important Document 2',
  },
  {
    id: '3',
    created: new Date().toISOString(),
    title: 'Important Document 3',
  },
];

const historicalPeople: Person[] = [
  {
    id: '1',
    name: 'Marie Curie',
    country: 'Poland',
    gender: 'Female',
    yearOfBirth: 1867,
  },
  {
    id: '2',
    name: 'Albert Einstein',
    country: 'Germany',
    gender: 'Male',
    yearOfBirth: 1879,
  },
  {
    id: '3',
    name: 'Ada Lovelace',
    country: 'United Kingdom',
    gender: 'Female',
    yearOfBirth: 1815,
  },
  {
    id: '4',
    name: 'Isaac Newton',
    country: 'United Kingdom',
    gender: 'Male',
    yearOfBirth: 1643,
  },
  {
    id: '5',
    name: 'Nikola Tesla',
    country: 'Croatia',
    gender: 'Male',
    yearOfBirth: 1856,
  },
  {
    id: '6',
    name: 'Rosalind Franklin',
    country: 'United Kingdom',
    gender: 'Female',
    yearOfBirth: 1920,
  },
  {
    id: '7',
    name: 'Leonardo da Vinci',
    country: 'Italy',
    gender: 'Male',
    yearOfBirth: 1452,
  },
  {
    id: '8',
    name: 'Galileo Galilei',
    country: 'Italy',
    gender: 'Male',
    yearOfBirth: 1564,
  },
  {
    id: '9',
    name: 'Sophie Germain',
    country: 'France',
    gender: 'Female',
    yearOfBirth: 1776,
  },
  {
    id: '10',
    name: 'Charles Darwin',
    country: 'United Kingdom',
    gender: 'Male',
    yearOfBirth: 1809,
  },
];

const getPeopleSettings = (persons: Person[]): FilterSetting[] => {
  return [
    {
      id: 'country',
      label: 'Country',
      unSelectedLabel: 'All Countries',
      operation: 'equals',
      options: (() => {
        const countries = persons.map((p) => p.country);
        const countryCounts = countOccurrences(countries);
        return Array.from(new Set(countries)).map((country) => ({
          displayLabel: country,
          value: country,
          count: countryCounts[country],
        }));
      })(),
    },
    {
      id: 'gender',
      label: 'Gender',
      unSelectedLabel: 'All Genders',
      operation: 'includes',
      options: (() => {
        const genders = persons.map((p) => p.gender);
        const genderCounts = countOccurrences(genders);
        return Array.from(new Set(genders)).map((gender) => ({
          displayLabel: gender,
          value: gender,
          count: genderCounts[gender],
        }));
      })(),
    },
    {
      id: 'yearOfBirth',
      label: 'Century',
      unSelectedLabel: 'All Centuries',
      operation: 'equals',
      options: (() => {
        const centuries = persons.map((person) => String(Math.ceil(person.yearOfBirth / 100)));
        const centuryCounts = countOccurrences(centuries);
        return Array.from(new Set(centuries)).map((century) => ({
          displayLabel: `${century}th Century`,
          value: `${century}th Century`,
          count: centuryCounts[century],
        }));
      })(),
    },
  ];
};

export default {
  title: 'Components/FilterBar',
  component: FilterBar,
  decorators: [
    withRouter,
    (Story) => {
      return (
        <div style={{ padding: 20 }}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    layout: 'fullscreen',
    docs: { source: { type: 'code' } }, // Important: https://github.com/storybookjs/storybook/issues/19575
  },
} as Meta<typeof FilterBar>;

function countOccurrences(array: string[]): Record<string, number> {
  return array.reduce(
    (acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
}

const Template: StoryObj<typeof FilterBar> = {
  render: (args) => {
    const [filteredPeople, setFilteredPeople] = useState<Person[]>(historicalPeople);

    const handleFilterChange = useCallback((filters: Filter[]) => {
      setFilteredPeople(
        historicalPeople.filter((person) =>
          filters.every((filter) => {
            if (filter.id === 'yearOfBirth') {
              const personCentury = `${Math.ceil(person.yearOfBirth / 100)}th Century`;
              return filter.value === personCentury;
            }
            return filter.value === person[filter.id as keyof Person];
          }),
        ),
      );
    }, []);

    const filterBarSettings = getPeopleSettings(historicalPeople);

    return (
      <div>
        <FilterBar {...args} settings={filterBarSettings} onFilterChange={handleFilterChange} />
        <ul>
          {filteredPeople.map((person) => (
            <li key={person.id}>
              <strong>Name:</strong> {person.name}, <strong>Country:</strong> {person.country}, <strong>Gender:</strong>
              {person.gender}, <strong>yearOfBirth:</strong>
              {person.yearOfBirth}
            </li>
          ))}
        </ul>
      </div>
    );
  },
  args: {
    settings: [],
  },
};

export const Default = Template;

const initialState: Filter[] = [
  {
    id: 'country',
    value: 'Poland',
  },
];
export const InitialState: StoryObj<typeof FilterBar> = {
  render: (args) => {
    const [filteredPeople, setFilteredPeople] = useState<Person[]>(historicalPeople);
    const filterPeople = useCallback((filters: Filter[]) => {
      return historicalPeople.filter((person) =>
        filters.every((filter) => filter.value === person[filter.id as keyof Person]),
      );
    }, []);
    const handleFilterChange = (filters: Filter[]) => {
      setFilteredPeople(filterPeople(filters));
    };

    useEffect(() => {
      setFilteredPeople(filterPeople(initialState));
    }, [filterPeople]);

    const filterBarSettings = getPeopleSettings(historicalPeople);

    return (
      <div>
        <FilterBar
          {...args}
          settings={filterBarSettings}
          initialFilters={initialState}
          onFilterChange={handleFilterChange}
        />
        <ul>
          {filteredPeople.map((person) => (
            <li key={person.id}>
              <strong>Name:</strong> {person.name}, <strong>Country:</strong> {person.country}, <strong>Gender:</strong>
              {person.gender}, <strong>yearOfBirth:</strong>
              {person.yearOfBirth}
            </li>
          ))}
        </ul>
      </div>
    );
  },
  args: {
    settings: [],
  },
};

export const DateFilter: StoryObj<typeof FilterBar> = {
  render: (args) => {
    const [filteredDocs, setFilteredDocs] = useState<Document[]>(importantDocs);
    const dayBeforeYesterday = new Date(new Date().getTime() - 48 * 60 * 60 * 1000).toISOString();
    const yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString();
    const today = new Date().toISOString();
    const filterBarSettings: FilterSetting[] = [
      {
        id: 'created',
        label: 'Created',
        unSelectedLabel: 'All Dates',
        operation: 'equals',
        options: [
          {
            value: dayBeforeYesterday,
            displayLabel: 'Day before yesterday',
            count: 1,
          },
          {
            value: yesterday,
            displayLabel: 'Yesterday',
            count: 1,
          },
          {
            value: today,
            displayLabel: 'Today',
            count: 1,
          },
          {
            value: `${dayBeforeYesterday}/${today}`,
            displayLabel: 'Select date',
            count: 1,
            options: [
              {
                value: CustomFilterValueType['$startTime/$endTime'],
                displayLabel: 'Velg dato selv',
              },
            ],
          },
        ],
      },
    ];

    const docsFilter = useCallback((filters: Filter[]) => {
      return importantDocs.filter((doc) => {
        return filters.every((filter) => {
          if (filter.id === 'created') {
            // Section ~ 3.2.6 of ISO 8601-1:2019 specifies that the date and time components are separated by a solidus (/).
            if ((filter.value as string).includes('/')) {
              const [startDate, endDate] = (filter.value as string).split('/');
              if (startDate && endDate) {
                return new Date(doc.created) >= new Date(startDate) && new Date(doc.created) <= new Date(endDate);
              }
              return new Date(doc.created) >= new Date(startDate);
            }
            return new Date(filter.value as string).toDateString() === new Date(doc.created).toDateString();
          }
          return filter.value === doc[filter.id as keyof Document];
        });
      });
    }, []);

    return (
      <div>
        <FilterBar
          {...args}
          settings={filterBarSettings}
          onFilterChange={(filters) => {
            setFilteredDocs(docsFilter(filters));
          }}
        />
        <ul>
          {filteredDocs.map((doc) => (
            <li key={doc.id}>
              <strong>Id:</strong> {doc.id}, <strong>Title:</strong> {doc.title}, <strong>Created:</strong>
              {doc.created}
            </li>
          ))}
        </ul>
      </div>
    );
  },
  args: {
    settings: [],
  },
};
