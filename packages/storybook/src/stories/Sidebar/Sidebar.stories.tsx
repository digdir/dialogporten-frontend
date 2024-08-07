import type { Meta } from '@storybook/react';
import { HorizontalLine, Sidebar } from 'frontend';
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
import { MenuItem } from 'frontend/src/components/MenuBar';

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
      <MenuItem
        displayText="Innboks"
        label="Trykk her for å gå til innboks"
        icon={<InboxFillIcon />}
        count={3}
        path="/innboks"
        isInbox
      />
      <HorizontalLine />
      <MenuItem displayText="Nytt skjema" label="Trykk her for å gå til utboks" icon={<PlusIcon />} path="/Nytt" />
      <MenuItem
        displayText="Utkast"
        label="Trykk her for å gå til Utkast"
        icon={<FileTextIcon />}
        count={8}
        path="/Utkast"
      />
      <MenuItem
        displayText="Sendt"
        label="Trykk her for å gå til Sendt"
        icon={<FileCheckmarkIcon />}
        count={8}
        path="/Sendt"
      />
      <HorizontalLine />
      <MenuItem
        displayText="Arkiv"
        label="Trykk her for å gå til Arkiv"
        icon={<FolderMinusIcon />}
        count={8}
        path="/Arkiv"
      />
      <MenuItem
        displayText="Slettet"
        label="Trykk her for å gå til Slettet"
        icon={<TrashIcon />}
        count={8}
        path="/Slettet"
      />
      <HorizontalLine />
      <MenuItem
        displayText="Lagrede søk"
        label="Trykk her for å gå til utboks"
        icon={<MagnifyingGlassIcon />}
        count={8}
        path="/Lagrede"
      />
      <MenuItem
        displayText="Innstillinger"
        label="Trykk her for å gå til utboks"
        icon={<CogIcon />}
        path="/innstillinger"
      />
    </Sidebar>
  );
};

const SidebarSimpleExampleCompany = () => {
  return <Sidebar isCompany />;
};

export const simpleDesktopExamplePerson: () => JSX.Element = () => <SidebarSimpleExamplePerson />;
export const simpleDesktopExampleCompany: () => JSX.Element = () => (
  <div className="isCompany">
    <SidebarSimpleExampleCompany />
  </div>
);
