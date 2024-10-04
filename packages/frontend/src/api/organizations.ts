import type { OrganizationFieldsFragment } from 'bff-types-generated';

interface OrganizationOutput {
  name: string;
  logo?: string;
}

export const getOrganization = (
  organizations: OrganizationFieldsFragment[],
  org: string,
  locale: string,
): OrganizationOutput | undefined => {
  const currentOrg = organizations?.find((o) => o.id?.includes(org as string));
  const name = currentOrg?.name && ((currentOrg.name[locale as keyof typeof currentOrg.name] ?? '') as string);
  const logo = currentOrg?.logo ?? '';
  if (name) {
    return {
      name,
      logo,
    };
  }
};
