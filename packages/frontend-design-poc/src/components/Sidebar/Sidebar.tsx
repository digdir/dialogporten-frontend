import React from 'react';
import styles from './sidebar.module.css'; // Import the CSS module
import { SidebarItem } from '../SidebarItem';
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

export interface SidebarProps {
	children?: React.ReactNode;
}

export const HorizontalLine = () => <hr className={styles.horizontalLine} />;

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
	return (
		<div className={styles.sidebar}>
			{children || (
				<>
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
				</>
			)}
		</div>
	);
};
