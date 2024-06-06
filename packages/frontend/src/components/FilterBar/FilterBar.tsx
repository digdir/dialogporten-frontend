import { useCallback, useEffect, useState } from 'react';
import { Backdrop } from '../Backdrop';
import { AddFilterButton } from './AddFilterButton';
import { FilterButton } from './FilterButton';
import styles from './filterBar.module.css';

export type FieldOptionOperation = 'equals' | 'includes';

export type FilterValueType = string | string[] | number | boolean | undefined;

export interface Filter {
  id: string;
  value: FilterValueType;
}
export interface FilterBarFieldOption {
  value: FilterValueType;
  displayLabel: string;
  count?: number;
  leftIcon?: React.ReactNode;
}

export interface FilterSetting {
  label: string;
  unSelectedLabel: string;
  id: string;
  operation: FieldOptionOperation;
  options: FilterBarFieldOption[];
  leftIcon?: React.ReactNode;
}

interface FilterBarProps {
  settings: FilterSetting[];
  onFilterChange: (newFilters: Filter[]) => void;
  initialFilters?: Filter[];
}

type ListOpenTarget = 'none' | 'add_filter' | string;

/**
 * `FilterBar` is a component that renders a dynamic filter UI, allowing users to add, remove, and modify filters based on predefined field options. It supports both value-based filters and unset filters, where the former applies a specific condition (e.g., equals, includes) to a field, and the latter signifies the absence of a filter on that field.
 *
 * The component is designed to be flexible, accommodating a variety of filter types through its configuration props. It manages its own state for active filters and the visibility of filter option lists, providing a callback for when the active filters change, enabling parent components to react to updates in the filter state.
 *
 * Props:
 * - `settings`: Array of `FilterSetting` objects that define the available filters and their options. Each setting includes a label, an ID, options (each with a value and display label), and optionally a count and a left icon.
 * - `onFilterChange`: Function called with the current array of active `Filter` objects whenever the active filters change, allowing parent components to respond to filter changes.
 * - `initialFilters`: (Optional) Array of `Filter` objects representing the initial state of active filters when the component mounts.
 *
 * The component renders a list of `FilterButton` components for each active filter, allowing users to remove filters or change their values. An `AddFilterButton` is also rendered, enabling the addition of new filters from the available `settings`.
 *
 * Usage:
 * The `FilterBar` is intended to be used in applications requiring dynamic filtering capabilities, such as data tables or lists that need to be filtered based on various criteria. It is designed to be integrated into a larger UI, where it can be positioned as needed to provide filtering functionality.
 *
 * Example:
 * ```
 * <FilterBar
 *   settings={[
 *     {
 *       label: 'Country',
 *       unSelectedLabel: 'All Countries',
 *       id: 'country',
 *       operation: 'equals',
 *       options: [
 *         { value: 'United States', displayLabel: 'United States', count: 10 },
 *         { value: 'Canada', displayLabel: 'Canada', count: 5 }
 *       ]
 *     },
 *     {
 *       label: 'Gender',
 *       unSelectedLabel: 'All Genders',
 *       id: 'gender',
 *       operation: 'equals',
 *       options: [
 *         { value: 'Male', displayLabel: 'Male', count: 15 },
 *         { value: 'Female', displayLabel: 'Female', count: 20 }
 *       ]
 *     }
 *   ]}
 *   onFilterChange={(filters) => console.log('Active filters:', filters)}
 *   initialFilters={[
 *     { id: 'country', value: 'United States' },
 *     { id: 'gender', value: 'Female' }
 *   ]}
 * />
 * ```
 */

export const FilterBar = ({ onFilterChange, settings, initialFilters = [] }: FilterBarProps) => {
  const [selectedFilters, setSelectedFilters] = useState<Filter[]>(initialFilters);
  const [listOpenTarget, setListOpenTarget] = useState<ListOpenTarget>('none');

  useEffect(() => {
    if (initialFilters?.length && !selectedFilters.length) {
      setSelectedFilters(initialFilters);
    }
  }, [initialFilters]);

  const handleOnRemove = useCallback(
    (filterId: string) => {
      const updatedFilters = selectedFilters.filter((filter) => filter.id !== filterId);
      setSelectedFilters(updatedFilters);
      onFilterChange(updatedFilters.filter((filter) => typeof filter.value !== 'undefined'));
    },
    [selectedFilters],
  );

  const getFilterSetting = (id: string): FilterSetting | undefined => {
    return settings.find((setting) => setting.id === id);
  };

  const onToggleFilter = useCallback(
    (id: string, value: FilterValueType) => {
      const existingFiltersForId = selectedFilters.filter((filter) => filter.id === id);
      const thisFilterAlreadyExists = selectedFilters.some((filter) => filter.id === id && filter.value === value);

      const settingForFilter = getFilterSetting(id);
      const allowMultiselect = settingForFilter?.operation === 'includes';

      let nextFilters: Filter[] = [];

      // Remove filter if it already exists
      if (thisFilterAlreadyExists) {
        nextFilters = selectedFilters.filter((filter) => !(filter.id === id && filter.value === value));
        if (nextFilters.filter((filter) => filter.id === id).length === 0) {
          // Add undefined filter if no values are left for the field
          nextFilters.push({ id, value: undefined });
        }
      } else {
        nextFilters = [...selectedFilters, { id, value }];
      }

      setSelectedFilters(nextFilters);
      onFilterChange(nextFilters.filter((filter) => typeof filter.value !== 'undefined'));

      // Selection is not done, keep the menu open
      if (allowMultiselect || !value) {
        setListOpenTarget(id);
      } else {
        setListOpenTarget(existingFiltersForId ? 'none' : id);
      }
    },
    [selectedFilters, onFilterChange, getFilterSetting],
  );

  const filtersById = selectedFilters.reduce((tail: Record<string, Filter[]>, current: Filter) => {
    if (!tail[current.id]) {
      tail[current.id] = [];
    }
    tail[current.id].push(current);
    return tail;
  }, {});

  return (
    <section className={styles.filterBar}>
      {Object.keys(filtersById).map((id) => {
        const settingForFilter = getFilterSetting(id);
        if (!settingForFilter) {
          return null;
        }

        const isMenuOpen = listOpenTarget === id;

        return (
          <FilterButton
            key={id}
            isOpen={isMenuOpen}
            filterFieldData={settingForFilter}
            onBtnClick={() => {
              setListOpenTarget(isMenuOpen ? 'none' : id);
            }}
            onRemove={() => handleOnRemove(id)}
            onListItemClick={onToggleFilter}
            selectedFilters={selectedFilters}
          />
        );
      })}
      <AddFilterButton
        isOpen={listOpenTarget === 'add_filter'}
        onAddBtnClick={() => {
          setListOpenTarget(listOpenTarget === 'add_filter' ? 'none' : 'add_filter');
        }}
        settings={settings}
        selectedFilters={selectedFilters}
        onListItemClick={onToggleFilter}
      />
      <Backdrop show={listOpenTarget !== 'none'} onClick={() => setListOpenTarget('none')} />
    </section>
  );
};
