import type { Meta } from '@storybook/react';
import { withRouter } from 'storybook-addon-react-router-v6';

import {
	FileTextIcon,
	FileCheckmarkIcon,
	FolderMinusIcon,
	TrashIcon,
	CogIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	InboxFillIcon,
} from '@navikt/aksel-icons';

import { SidebarItem } from '../../../../frontend-design-poc/src/components/SidebarItem';
import { Sidebar } from '../../../../frontend-design-poc/src/components/Sidebar';
import { HorizontalLine } from '../../../../frontend-design-poc/src/components/Sidebar/Sidebar';

const meta = {
	title: 'Example/Sidebar',
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
				url="/innboks"
				isInbox
			/>
			<HorizontalLine />
			<SidebarItem
				displayText="Nytt skjema"
				label="Trykk her for å gå til utboks"
				icon={<PlusIcon />}
				url="/Nytt"
				isButton
			/>
			<SidebarItem
				displayText="Utkast"
				label="Trykk her for å gå til Utkast"
				icon={<FileTextIcon />}
				count={8}
				url="/Utkast"
			/>
			<SidebarItem
				displayText="Sendt"
				label="Trykk her for å gå til Sendt"
				icon={<FileCheckmarkIcon />}
				count={8}
				url="/Sendt"
			/>
			<HorizontalLine />
			<SidebarItem
				displayText="Arkiv"
				label="Trykk her for å gå til Arkiv"
				icon={<FolderMinusIcon />}
				count={8}
				url="/Arkiv"
			/>
			<SidebarItem
				displayText="Slettet"
				label="Trykk her for å gå til Slettet"
				icon={<TrashIcon />}
				count={8}
				url="/Slettet"
			/>
			<HorizontalLine />
			<SidebarItem
				displayText="Lagrede søk"
				label="Trykk her for å gå til utboks"
				icon={<MagnifyingGlassIcon />}
				count={8}
				url="/Lagrede"
				type="secondary"
			/>
			<SidebarItem
				displayText="Innstillinger"
				label="Trykk her for å gå til utboks"
				icon={<CogIcon />}
				url="/innstillinger"
				type="secondary"
			/>
		</Sidebar>
	);
};
const SidebarSimpleExampleCompany = () => {
	return (
		<Sidebar>
			<SidebarItem
				displayText="Innboks"
				label="Trykk her for å gå til innboks"
				icon={<InboxFillIcon />}
				count={3}
				url="/innboks"
				isInbox
				isCompany
			/>
			<HorizontalLine />
			<SidebarItem
				displayText="Nytt skjema"
				label="Trykk her for å gå til utboks"
				icon={<PlusIcon />}
				url="/Nytt"
				isButton
				isCompany
			/>
			<SidebarItem
				displayText="Utkast"
				label="Trykk her for å gå til Utkast"
				icon={<FileTextIcon />}
				count={8}
				url="/Utkast"
				isCompany
			/>
			<SidebarItem
				displayText="Sendt"
				label="Trykk her for å gå til Sendt"
				icon={<FileCheckmarkIcon />}
				count={8}
				url="/Sendt"
				isCompany
			/>
			<HorizontalLine />
			<SidebarItem
				displayText="Arkiv"
				label="Trykk her for å gå til Arkiv"
				icon={<FolderMinusIcon />}
				count={8}
				url="/Arkiv"
				isCompany
			/>
			<SidebarItem
				displayText="Slettet"
				label="Trykk her for å gå til Slettet"
				icon={<TrashIcon />}
				count={8}
				url="/Slettet"
				isCompany
			/>
			<HorizontalLine />
			<SidebarItem
				displayText="Lagrede søk"
				label="Trykk her for å gå til utboks"
				icon={<MagnifyingGlassIcon />}
				count={8}
				url="/Lagrede"
				type="secondary"
				isCompany
			/>
			<SidebarItem
				displayText="Innstillinger"
				label="Trykk her for å gå til utboks"
				icon={<CogIcon />}
				url="/innstillinger"
				type="secondary"
				isCompany
			/>
		</Sidebar>
	);
};

export const simpleDesktopExamplePerson: () => JSX.Element = () => <SidebarSimpleExamplePerson />;
export const simpleDesktopExampleCompany: () => JSX.Element = () => <SidebarSimpleExampleCompany />;
