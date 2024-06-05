import React, { useState, useContext, createContext } from 'react';

type SelectedState = {
  [key: string]: boolean;
};

type ContextType = {
  selectedItems: SelectedState;
  setSelectedItems: React.Dispatch<React.SetStateAction<SelectedState>>;
};
const SelectedContext = createContext<ContextType | {}>({});

/*
 *   A hook used to get and update bulk selection of Dialogs in different views
 **/
export const useSelectedDialogs = () => {
  const { selectedItems, setSelectedItems } = useContext(SelectedContext) as ContextType;
  const selectedItemCount = Object.values(selectedItems || []).filter(Boolean).length;

  return { selectedItems, setSelectedItems, selectedItemCount };
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
