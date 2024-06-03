import { useCallback, useEffect, useState } from 'react';
import { AddFilterButton } from './AddFilterButton';
import { FilterButton } from './FilterButton';
import styles from './filterBar.module.css';

export type FieldOptionOperation = 'equals' | 'includes';

interface ValueFilter {
  fieldName: string | ((item: Record<string, string | number | boolean>) => string);
  operation: FieldOptionOperation;
  value: string;
  label: string;
}

export interface UnsetValueFilter {
  fieldName: string;
  operation: 'unset';
  label: string;
  value?: string | string[];
}

export type Filter = ValueFilter | UnsetValueFilter;

export interface FilterBarFieldOption {
  id: string;
  label: string;
  operation: FieldOptionOperation;
  value: string;
  count: number;
}

export interface FilterBarField {
  label: string;
  unSelectedLabel: string;
  id: string;
  options: FilterBarFieldOption[];
  chosenOptionId?: string | string[];
  leftIcon?: React.ReactNode;
}

interface FilterBarProps {
  fields: FilterBarField[];
  onFilterChange: (filters: Filter[]) => void;
  initialFilters?: Filter[];
}

type ListOpenTarget = 'none' | string | 'add_filter';

/**
 * `FilterBar` is a component that renders a dynamic filter UI, allowing users to add, remove, and modify filters based on predefined field options. It supports both value-based filters and unset filters, where the former applies a specific condition (e.g., equals, includes) to a field, and the latter signifies the absence of a filter on that field.
 *
 * The component is designed to be flexible, accommodating a variety of filter types through its configuration props. It manages its own state for active filters and the visibility of filter option lists, providing a callback for when the active filters change, enabling parent components to react to updates in the filter state.
 *
 * Props:
 * - `fields`: Array of `FilterBarField` objects that define the available filters and their options. Each field includes a label, an ID, options (each with a label, value, and count), and optionally a chosen option ID and a left icon.
 * - `onFilterChange`: Function called with the current array of active `Filter` objects whenever the active filters change, allowing parent components to respond to filter changes.
 * - `initialFilters`: (Optional) Array of `Filter` objects representing the initial state of active filters when the component mounts.
 *
 * The component renders a list of `FilterButton` components for each active filter, allowing users to remove filters or change their values. An `AddFilterButton` is also rendered, enabling the addition of new filters from the available `fields`.
 *
 * Usage:
 * The `FilterBar` is intended to be used in applications requiring dynamic filtering capabilities, such as data tables or lists that need to be filtered based on various criteria. It is designed to be integrated into a larger UI, where it can be positioned as needed to provide filtering functionality.
 *
 * Example:
 * ```
 * <FilterBar
 *   fields={[
 *     {
 *       label: 'Country',
 *       unSelectedLabel: 'All Countries',
 *       id: 'country',
 *       options: [
 *         { id: 'us', label: 'United States', value: 'United States', count: 10, operation: 'equals' },
 *         { id: 'ca', label: 'Canada', value: 'Canada', count: 5, operation: 'equals' }
 *       ]
 *     },
 *     {
 *       label: 'Gender',
 *       unSelectedLabel: 'All Genders',
 *       id: 'gender',
 *       options: [
 *         { id: 'male', label: 'Male', value: 'Male', count: 15, operation: 'equals' },
 *         { id: 'female', label: 'Female', value: 'Female', count: 20, operation: 'equals' }
 *       ]
 *     }
 *   ]}
 *   onFilterChange={(filters) => console.log('Active filters:', filters)}
 * />
 * ```
 */
export const FilterBar = ({ onFilterChange, fields, initialFilters = [] }: FilterBarProps) => {
  const [activeFilters, setActiveFilters] = useState<Filter[]>(initialFilters);
  const [listOpenTarget, setListOpenTarget] = useState<ListOpenTarget>('none');

  useEffect(() => {
    if (initialFilters?.length) {
      setActiveFilters(initialFilters || []);
    }
  }, [initialFilters]);

  const handleOnRemove = useCallback(
    (fieldName: string) => {
      const updatedFilters = activeFilters.filter((filter) => filter.fieldName !== fieldName);
      setActiveFilters(updatedFilters);
      onFilterChange(updatedFilters);
    },
    [activeFilters, onFilterChange],
  );

  const handleFilterUpdate = useCallback(
    (fieldName: string, option?: FilterBarFieldOption) => {
      const filterFound = !!activeFilters.find((filter) => filter.fieldName === fieldName);
      let newFilters = activeFilters.slice();
      if (!filterFound && !option) {
        newFilters = [
          ...activeFilters,
          {
            fieldName,
            operation: 'unset',
            label: '',
          },
        ];
      } else if (filterFound && option) {
        newFilters = activeFilters.map((filter) => {
          if (filter.fieldName === fieldName) {
            return {
              fieldName,
              value: option.value,
              label: option.label,
              operation: option.operation,
            };
          }
          return filter;
        });
      }

      setActiveFilters(newFilters);
      onFilterChange(newFilters);
    },
    [activeFilters, onFilterChange],
  );

  return (
    <section className={styles.filterBar}>
      {activeFilters.map((filter) => {
        const filterOption = fields.find((field) => field.id === filter.fieldName);
        if (!filterOption) {
          return null;
        }

        const displayLabel = Array.isArray(filter.value) ? `${filter.value.length} selected` : filter.label;

        return (
          <FilterButton
            onRemove={() => handleOnRemove(filterOption.id)}
            isOpen={listOpenTarget === filterOption.id}
            onBtnClick={() => {
              setListOpenTarget(listOpenTarget === filterOption.id ? 'none' : filterOption.id);
            }}
            key={filterOption.id}
            filterOption={filterOption}
            onListItemClick={(id, option) => {
              handleFilterUpdate(id, option);
              setListOpenTarget('none');
            }}
            displayLabel={displayLabel}
          />
        );
      })}
      <AddFilterButton
        isOpen={listOpenTarget === 'add_filter'}
        onBtnClick={() => {
          setListOpenTarget(listOpenTarget === 'add_filter' ? 'none' : 'add_filter');
        }}
        filterOptions={fields}
        filters={activeFilters}
        onListItemClick={(filterOpt) => {
          const chosenOption =
            typeof filterOpt?.chosenOptionId !== 'undefined'
              ? filterOpt.options.find((option: FilterBarFieldOption) => option.id === filterOpt?.chosenOptionId)
              : undefined;
          handleFilterUpdate(filterOpt.id, chosenOption);
          setListOpenTarget(filterOpt.id);
        }}
      />
      {listOpenTarget !== 'none' && (
        <div
          className={styles.background}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              setListOpenTarget('none');
            }
          }}
          onClick={() => setListOpenTarget('none')}
        />
      )}
    </section>
  );
};
