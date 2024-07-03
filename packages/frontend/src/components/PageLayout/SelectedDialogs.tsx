import type React from 'react';
import { createContext, useContext, useState } from 'react';

type SelectedState = {
  [key: string]: boolean;
};

type ContextType = {
  selectedItems: SelectedState;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedState>>;
};
const SelectedContext = createContext<ContextType>({
  selectedItems: {},
  setSelectedItems: () => {},
});

/*
 *   A hook used to get and update bulk selection of Dialogs in different views
 **/
export const useSelectedDialogs = () => {
  const { selectedItems, setSelectedItems } = useContext(SelectedContext) as ContextType;
  const selectedItemCount = Object.values(selectedItems || []).filter(Boolean).length;
  const inSelectionMode = selectedItemCount > 0;

  return { selectedItems, setSelectedItems, selectedItemCount, inSelectionMode };
};

/*
 *   Wrap the body to allow components to use selections
 **/
export const SelectedDialogsContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedState>({});

  return (
    <SelectedContext.Provider
      value={{
        selectedItems,
        setSelectedItems,
      }}
    >
      {children}
    </SelectedContext.Provider>
  );
};
