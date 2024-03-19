import { FlagCrossIcon, HourglassIcon, PersonIcon } from '@navikt/aksel-icons';
import { Meta, StoryObj } from '@storybook/react';
import { type Filter, FilterBar } from 'frontend-design-poc/src/components/FilterBar';
import { FilterBarField } from 'frontend-design-poc/src/components/FilterBar/FilterBar.tsx';
import { useCallback, useEffect, useMemo, useState } from 'react';
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

export default {
  title: 'Components/FilterBar',
  component: FilterBar,
  decorators: [withRouter],
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
              return filter.value.includes(String(person[filter.fieldName as keyof Person]));
            }
            if (typeof filter.value === 'string') {
              if (filter.fieldName === 'yearOfBirth') {
                const personCentury = `${Math.ceil(person.yearOfBirth / 100)}th Century`;
                return filter.value === personCentury;
              }
              return filter.value === person[filter.fieldName as keyof Person];
            }
            return true;
          });
        }),
      );
    }, []);

    const fields: FilterBarField[] = useMemo(() => {
      return [
        {
          id: 'country',
          label: 'Country',
          unSelectedLabel: 'All Countries',
          leftIcon: <FlagCrossIcon />,
          options: (() => {
            const countries = filteredPeople.map((p) => p.country);
            const countryCounts = countOccurrences(countries);
            return Array.from(new Set(countries)).map((country) => ({
              id: country,
              label: country,
              value: country,
              count: countryCounts[country],
              operation: 'equals',
            }));
          })(),
        },
        {
          id: 'gender',
          label: 'Gender',
          unSelectedLabel: 'All Genders',
          leftIcon: <PersonIcon />,
          options: (() => {
            const genders = filteredPeople.map((p) => p.gender);
            const genderCounts = countOccurrences(genders);
            return Array.from(new Set(genders)).map((gender) => ({
              id: gender,
              label: gender,
              value: gender,
              count: genderCounts[gender],
              operation: 'equals',
            }));
          })(),
        },
        {
          id: 'yearOfBirth',
          label: 'Century',
          unSelectedLabel: 'All Centuries',
          leftIcon: <HourglassIcon />,
          options: (() => {
            const centuries = filteredPeople.map((person) => String(Math.ceil(person.yearOfBirth / 100)));
            const centuryCounts = countOccurrences(centuries);
            return Array.from(new Set(centuries)).map((century) => ({
              id: String(century),
              label: `${century}th Century`,
              value: `${century}th Century`,
              count: centuryCounts[century],
              operation: 'equals',
            }));
          })(),
        },
      ];
    }, [filteredPeople]);

    return (
      <div>
        <FilterBar {...args} fields={fields} onFilterChange={handleFilterChange} />
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
    fields: [],
  },
};

export const Default = Template;

const initialState: Filter[] = [
  {
    fieldName: 'country',
    operation: 'equals',
    value: 'Poland',
    label: 'Poland',
  },
];
export const InitialState: StoryObj<typeof FilterBar> = {
  render: (args) => {
    const [filteredPeople, setFilteredPeople] = useState<Person[]>(historicalPeople);
    const filterPeople = useCallback((filters: Filter[]) => {
      return historicalPeople.filter((person) => {
        return filters.every((filter) => {
          if (Array.isArray(filter.value)) {
            return filter.value.includes(String(person[filter.fieldName as keyof Person]));
          }
          if (typeof filter.value === 'string') {
            return filter.value === person[filter.fieldName as keyof Person];
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

    const fields: FilterBarField[] = useMemo(() => {
      return [
        {
          id: 'country',
          label: 'Country',
          unSelectedLabel: 'All Countries',
          leftIcon: <FlagCrossIcon />,
          options: (() => {
            const countries = filteredPeople.map((p) => p.country);
            const countryCounts = countOccurrences(countries);
            return Array.from(new Set(countries)).map((country) => ({
              id: country,
              label: country,
              value: country,
              count: countryCounts[country],
              operation: 'equals',
            }));
          })(),
        },
        {
          id: 'gender',
          label: 'Gender',
          unSelectedLabel: 'All Genders',
          leftIcon: <PersonIcon />,
          options: (() => {
            const genders = filteredPeople.map((p) => p.gender);
            const genderCounts = countOccurrences(genders);
            return Array.from(new Set(genders)).map((gender) => ({
              id: gender,
              label: gender,
              value: gender,
              count: genderCounts[gender],
              operation: 'equals',
            }));
          })(),
        },
      ];
    }, [filteredPeople]);

    return (
      <div>
        <FilterBar {...args} fields={fields} initialFilters={initialState} onFilterChange={handleFilterChange} />
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
    fields: [],
  },
};
