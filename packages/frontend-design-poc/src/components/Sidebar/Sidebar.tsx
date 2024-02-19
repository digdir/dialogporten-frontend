import React from 'react';
import styles from './sidebar.module.css'; // Import the CSS module
import { SidebarItem } from './SidebarItem';
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
import { useTranslation } from 'react-i18next';

export interface SidebarProps {
	children?: React.ReactNode;
}

export const HorizontalLine = () => <hr className={styles.horizontalLine} />;

export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
	const { t } = useTranslation();
	return (
		<div className={styles.sidebar}>
			{children || (
				<>
					<SidebarItem
						displayText={t('inbox.title')}
						label="Trykk her for å gå til innboks"
						icon={<InboxFillIcon />}
						count={3}
						path="/inbox"
						isInbox
						isCompany
					/>
					<HorizontalLine />
					<SidebarItem
						displayText={t('sidebar.new_form')}
						label="Trykk her for å lage nytt skjema"
						icon={<PlusIcon />}
						path="/Nytt"
						isButton
						isCompany
					/>
					<SidebarItem
						displayText={t('sidebar.drafts')}
						label="Trykk her for å gå til Utkast"
						icon={<FileTextIcon />}
						count={8}
						path="/Utkast"
						isCompany
					/>
					<SidebarItem
						displayText={t('sidebar.sent')}
						label="Trykk her for å gå til Sendt"
						icon={<FileCheckmarkIcon />}
						count={8}
						path="/Sendt"
						isCompany
					/>
					<HorizontalLine />
					<SidebarItem
						displayText={t('sidebar.archived')}
						label="Trykk her for å gå til Arkiv"
						icon={<FolderMinusIcon />}
						count={8}
						path="/Arkiv"
						isCompany
					/>
					<SidebarItem
						displayText={t('sidebar.deleted')}
						label="Trykk her for å gå til Slettet"
						icon={<TrashIcon />}
						count={8}
						path="/Slettet"
						isCompany
					/>
					<HorizontalLine />
					<SidebarItem
						displayText={t('sidebar.saved_searches')}
						label="Trykk her for å gå til lagrede søk"
						icon={<MagnifyingGlassIcon />}
						count={8}
						path="/Lagrede"
						type="secondary"
						isCompany
					/>
					<SidebarItem
						displayText={t('sidebar.settings')}
						label="Trykk her for å gå til innstillinger"
						icon={<CogIcon />}
						path="/innstillinger"
						type="secondary"
						isCompany
					/>
				</>
			)}
		</div>
	);
};
