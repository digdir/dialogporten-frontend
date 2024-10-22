import type { SearchDialogFieldsFragment } from 'bff-types-generated';

export const naiveSearchFilter = (dialog: SearchDialogFieldsFragment, search?: string) => {
  if (!search) {
    return true;
  }

  const searchLower = search.toLowerCase();
  return (
    dialog.content?.title?.value?.some((title) => title.value.toLowerCase().includes(searchLower)) ||
    dialog.content?.summary?.value?.some((summary) => summary.value.toLowerCase().includes(searchLower)) ||
    dialog.content?.senderName?.value?.some((senderName) => senderName.value.toLowerCase().includes(searchLower))
  );
};
