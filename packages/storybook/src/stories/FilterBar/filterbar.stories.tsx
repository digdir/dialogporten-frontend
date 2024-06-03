import { FlagCrossIcon, HourglassIcon, PersonIcon } from '@navikt/aksel-icons';
import { Meta, StoryObj } from '@storybook/react';
import { Filter, FilterBar } from 'frontend';
import { FilterSetting } from 'frontend/src/components/FilterBar/FilterBar.tsx';
import { useCallback, useEffect, useState } from 'react';
import { withRouter } from 'storybook-addon-react-router-v6';

type Person = {
  id: string;
  name: string;
  country: string;
  gender: 'Male' | 'Female';
  yearOfBirth: number;
};

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

const getFilterSettings = (persons: Person[]): FilterSetting[] => {
  return [
    {
      id: 'country',
      label: 'Country',
      unSelectedLabel: 'All Countries',
      operation: 'equals',
      leftIcon: <FlagCrossIcon />,
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
      leftIcon: <PersonIcon />,
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
      leftIcon: <HourglassIcon />,
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
        historicalPeople.filter((person) => {
          return filters.every((filter) => {
            if (Array.isArray(filter.value)) {
              return filter.value.includes(String(person[filter.id as keyof Person]));
            }
            if (typeof filter.value === 'string') {
              if (filter.id === 'yearOfBirth') {
                const personCentury = `${Math.ceil(person.yearOfBirth / 100)}th Century`;
                return filter.value === personCentury;
              }
              return filter.value === person[filter.id as keyof Person];
            }
            return true;
          });
        }),
      );
    }, []);

    const filterBarSettings = getFilterSettings(historicalPeople);

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
      return historicalPeople.filter((person) => {
        return filters.every((filter) => {
          if (Array.isArray(filter.value)) {
            return filter.value.includes(String(person[filter.id as keyof Person]));
          }
          if (typeof filter.value === 'string') {
            return filter.value === person[filter.id as keyof Person];
          }
          return true;
        });
      });
    }, []);
    const handleFilterChange = (filters: Filter[]) => {
      setFilteredPeople(filterPeople(filters));
    };

    useEffect(() => {
      setFilteredPeople(filterPeople(initialState));
    }, [filterPeople]);

    const filterBarSettings = getFilterSettings(historicalPeople);

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
