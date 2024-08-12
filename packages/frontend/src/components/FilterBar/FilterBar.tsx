import { type ForwardedRef, forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { Backdrop } from '../Backdrop';
import { AddFilterButton } from './AddFilterButton';
import { FilterButton } from './FilterButton';
import { ShowFilterResultsButton } from './ShowFilterResultsButton.tsx';
import styles from './filterBar.module.css';

export type FieldOptionOperation = 'equals' | 'includes';
export enum CustomFilterValueType {
  '$startTime/$endTime' = '$startTime/$endTime',
}
export type FilterValueType = string | string[] | number | boolean | undefined | typeof CustomFilterValueType;

export interface Filter {
  id: string;
  value: FilterValueType;
}

export interface FilterBarFieldOption {
  value: FilterValueType;
  displayLabel: string;
  options?: FilterBarFieldOption[];
  count?: number;
  horizontalRule?: boolean;
}

export interface FilterSetting {
  label: string;
  unSelectedLabel: string;
  mobileNavLabel: string;
  id: string;
  operation: FieldOptionOperation;
  options: FilterBarFieldOption[];
  horizontalRule?: boolean;
}

interface FilterBarProps {
  settings: FilterSetting[];
  onFilterChange: (newFilters: Filter[]) => void;
  initialFilters?: Filter[];
  addFilterBtnClassNames?: string;
  resultsCount?: number;
}

export interface SubLevelState {
  id: string;
  parentOptionValue: FilterValueType;
  level: number;
}

type ListOpenTarget = 'none' | 'add_filter' | string;

export type FilterBarRef = {
  openFilter: () => void;
  resetFilters: () => void;
};

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
export const FilterBar = forwardRef(
  (
    { onFilterChange, settings, initialFilters = [], addFilterBtnClassNames, resultsCount }: FilterBarProps,
    ref: ForwardedRef<FilterBarRef>,
  ) => {
    const [selectedFilters, setSelectedFilters] = useState<Filter[]>([]);
    const [listOpenForTarget, setListOpenForTarget] = useState<ListOpenTarget>('none');
    const [currentSubLevelMenu, setCurrentSubLevelMenu] = useState<SubLevelState | undefined>();

    useImperativeHandle(ref, () => ({
      openFilter() {
        setListOpenForTarget('add_filter');
      },
      resetFilters() {
        setSelectedFilters([]);
      },
    }));

    // biome-ignore lint: lint/correctness/useExhaustiveDependencies
    useEffect(() => {
      if (initialFilters.length && !selectedFilters.length) {
        setSelectedFilters(initialFilters);
      }
    }, [initialFilters]);

    const handleOnRemove = useCallback(
      (filterId: string) => {
        const updatedFilters = selectedFilters.filter((filter) => filter.id !== filterId);
        setSelectedFilters(updatedFilters);
        onFilterChange(updatedFilters.filter((filter) => typeof filter.value !== 'undefined'));
      },
      [selectedFilters, onFilterChange],
    );

    const getFilterSetting = (id: string) => settings.find((setting) => setting.id === id);

    /**
     * Toggles the filter value for a given filter ID. If `overrideValue` is `true`,
     * it updates the existing filter with the new value. Otherwise, it adds or removes
     * the filter based on its current state. Manages the visibility of the filter list
     * and resets sub-level menu state accordingly.
     */

    // biome-ignore lint/correctness/useExhaustiveDependencies: Full control of what triggers this code is needed
    const onToggleFilter = useCallback(
      (id: string, value: FilterValueType, overrideValue?: boolean) => {
        const existingFilters = selectedFilters.filter((filter) => filter.id === id);
        const filterExists = existingFilters.some((filter) => filter.value === value);
        const setting = getFilterSetting(id);
        const allowMultiselect = setting?.operation === 'includes';

        let updatedFilters: Filter[];

        if (overrideValue) {
          updatedFilters = selectedFilters.map((filter) => (filter.id === id ? { ...filter, value } : filter));
        } else {
          updatedFilters = filterExists
            ? selectedFilters.filter((filter) => !(filter.id === id && filter.value === value))
            : [...selectedFilters, { id, value }];

          if (!updatedFilters.some((filter) => filter.id === id)) {
            updatedFilters.push({ id, value: undefined });
          }
        }

        setSelectedFilters(updatedFilters);
        onFilterChange(updatedFilters.filter((filter) => typeof filter.value !== 'undefined'));
        const shouldNotDismiss = allowMultiselect || !value;

        if (shouldNotDismiss) {
          setListOpenForTarget(id);
        } else {
          setListOpenForTarget('none');
        }
        setCurrentSubLevelMenu(undefined);
      },
      [selectedFilters, onFilterChange],
    );
    const filtersById = selectedFilters.reduce(
      (acc, filter) => {
        if (!acc[filter.id]) acc[filter.id] = [];
        acc[filter.id].push(filter);
        return acc;
      },
      {} as Record<string, Filter[]>,
    );

    const isAddFilterMenuOpen = listOpenForTarget === 'add_filter';
    return (
      <section className={styles.filterBar}>
        <div className={styles.filterButtons}>
          {Object.keys(filtersById).map((id) => {
            const setting = getFilterSetting(id)!;
            const isFilterMenuOpen = listOpenForTarget === id;
            return (
              <FilterButton
                key={id}
                isOpen={isFilterMenuOpen}
                filterFieldData={setting}
                onBtnClick={() => setListOpenForTarget(isFilterMenuOpen ? 'none' : id)}
                onBackBtnClick={() => setListOpenForTarget('add_filter')}
                onRemove={() => handleOnRemove(id)}
                onListItemClick={onToggleFilter}
                selectedFilters={selectedFilters}
                currentSubMenuLevel={currentSubLevelMenu}
                onSubMenuLevelClick={setCurrentSubLevelMenu}
              />
            );
          })}
          <AddFilterButton
            isMenuOpen={isAddFilterMenuOpen}
            onAddBtnClick={() => setListOpenForTarget(isAddFilterMenuOpen ? 'none' : 'add_filter')}
            settings={settings}
            selectedFilters={selectedFilters}
            onListItemClick={onToggleFilter}
            onClose={() => setListOpenForTarget('none')}
            className={addFilterBtnClassNames}
          />
        </div>
        <ShowFilterResultsButton
          show={listOpenForTarget !== 'none'}
          resultsCount={resultsCount}
          onClick={() => setListOpenForTarget('none')}
        />
        <Backdrop show={listOpenForTarget !== 'none'} onClick={() => setListOpenForTarget('none')} />
      </section>
    );
  },
);
