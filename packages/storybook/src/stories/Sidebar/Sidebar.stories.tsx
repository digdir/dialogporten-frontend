import type { Meta } from '@storybook/react';
import { HorizontalLine, Sidebar, SidebarItem } from 'frontend-design-poc';
import { withRouter } from 'storybook-addon-react-router-v6';

import {
  CogIcon,
  FileCheckmarkIcon,
  FileTextIcon,
  FolderMinusIcon,
  InboxFillIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
} from '@navikt/aksel-icons';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  decorators: [withRouter],
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
const SidebarSimpleExamplePerson = () => {
  return (
    <Sidebar>
      <SidebarItem
        displayText="Innboks"
        label="Trykk her for å gå til innboks"
        icon={<InboxFillIcon />}
        count={3}
        path="/innboks"
        isInbox
      />
      <HorizontalLine />
      <SidebarItem
        displayText="Nytt skjema"
        label="Trykk her for å gå til utboks"
        icon={<PlusIcon />}
        path="/Nytt"
        isButton
      />
      <SidebarItem
        displayText="Utkast"
        label="Trykk her for å gå til Utkast"
        icon={<FileTextIcon />}
        count={8}
        path="/Utkast"
      />
      <SidebarItem
        displayText="Sendt"
        label="Trykk her for å gå til Sendt"
        icon={<FileCheckmarkIcon />}
        count={8}
        path="/Sendt"
      />
      <HorizontalLine />
      <SidebarItem
        displayText="Arkiv"
        label="Trykk her for å gå til Arkiv"
        icon={<FolderMinusIcon />}
        count={8}
        path="/Arkiv"
      />
      <SidebarItem
        displayText="Slettet"
        label="Trykk her for å gå til Slettet"
        icon={<TrashIcon />}
        count={8}
        path="/Slettet"
      />
      <HorizontalLine />
      <SidebarItem
        displayText="Lagrede søk"
        label="Trykk her for å gå til utboks"
        icon={<MagnifyingGlassIcon />}
        count={8}
        path="/Lagrede"
        type="secondary"
      />
      <SidebarItem
        displayText="Innstillinger"
        label="Trykk her for å gå til utboks"
        icon={<CogIcon />}
        path="/innstillinger"
        type="secondary"
      />
    </Sidebar>
  );
};

const SidebarSimpleExampleCompany = () => {
  return <Sidebar isCompany />;
};

export const simpleDesktopExamplePerson: () => JSX.Element = () => <SidebarSimpleExamplePerson />;
export const simpleDesktopExampleCompany: () => JSX.Element = () => <SidebarSimpleExampleCompany />;
