import type { BadgeColor, BadgeProps, MenuItemProps } from '@altinn/altinn-components';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useWindowSize } from '../../../../utils/useWindowSize.tsx';
import type { InboxViewType } from '../../../api/useDialogs.tsx';
import { Routes } from '../../../pages/Inbox/Inbox.tsx';
export type SideBarView = InboxViewType | 'saved-searches' | 'archive' | 'bin';

export type ItemPerViewCount = {
  [key in SideBarView]: number;
};

interface UseSidebarProps {
  itemsPerViewCount: ItemPerViewCount;
}

interface UseGlobalMenuProps {
  sidebar: MenuItemProps[];
  global: MenuItemProps[];
}

const getBadgeProps = (count: number, color?: BadgeColor): BadgeProps | undefined => {
  if (count > 0) {
    return {
      label: count.toString(),
      size: 'sm',
      color,
    };
  }
};

const createMenuItemComponent =
  ({ to, isExternal = false }: { to: string; isExternal?: boolean }): React.FC<MenuItemProps> =>
  (props) => <Link {...props} to={to} {...(isExternal ? { target: '__blank', rel: 'noopener noreferrer' } : {})} />;

export const useGlobalMenu = ({ itemsPerViewCount }: UseSidebarProps): UseGlobalMenuProps => {
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const { isMobile } = useWindowSize();
  const linksMenuItems: MenuItemProps[] = [
    {
      id: 'all-services',
      groupId: 'global',
      icon: 'menu-grid',
      title: t('menuBar.all_services'),
      size: 'lg',
      as: createMenuItemComponent({
        to: 'https://info.altinn.no/skjemaoversikt',
        isExternal: true,
      }),
    },
    {
      id: 'chat',
      groupId: 'global',
      icon: 'person-chat',
      title: t('menuBar.chat'),
      size: 'lg',
      as: createMenuItemComponent({
        to: 'https://info.altinn.no/hjelp/',
        isExternal: true,
      }),
    },
  ];
  const sidebar: MenuItemProps[] = [
    {
      id: '1',
      groupId: 'global',
      size: 'lg',
      icon: 'inbox',
      title: t('sidebar.inbox'),
      color: 'strong',
      badge: getBadgeProps(itemsPerViewCount.inbox, 'alert'),
      selected: pathname === Routes.inbox,
      expanded: true,
      as: createMenuItemComponent({
        to: Routes.inbox + search,
      }),
      items: [
        {
          id: '2',
          groupId: '2',
          icon: 'doc-pencil',
          title: t('sidebar.drafts'),
          badge: getBadgeProps(itemsPerViewCount.drafts),
          selected: pathname === Routes.drafts,
          as: createMenuItemComponent({
            to: Routes.drafts + search,
          }),
        },
        {
          id: '3',
          groupId: '2',
          icon: 'file-checkmark',
          title: t('sidebar.sent'),
          badge: getBadgeProps(itemsPerViewCount.sent),
          selected: pathname === Routes.sent,
          as: createMenuItemComponent({
            to: Routes.sent + search,
          }),
        },
        {
          id: '4',
          groupId: '3',
          icon: 'bookmark',
          title: t('sidebar.saved_searches'),
          badge: getBadgeProps(itemsPerViewCount['saved-searches']),
          selected: pathname === Routes.savedSearches,
          as: createMenuItemComponent({
            to: Routes.savedSearches + search,
          }),
        },
        {
          id: '5',
          groupId: '4',
          icon: 'archive',
          title: t('sidebar.archived'),
          badge: getBadgeProps(itemsPerViewCount.archive),
          selected: pathname === Routes.archive,
          as: createMenuItemComponent({
            to: Routes.archive + search,
          }),
        },
        {
          id: '6',
          groupId: '4',
          icon: 'trash',
          title: t('sidebar.deleted'),
          badge: getBadgeProps(itemsPerViewCount.bin),
          selected: pathname === Routes.bin,
          as: createMenuItemComponent({
            to: Routes.bin + search,
          }),
        },
      ],
    },
  ];

  const global: MenuItemProps[] = [
    {
      ...sidebar[0],
      color: 'neutral',
      items: isMobile ? sidebar[0].items : [],
      expanded: isMobile,
    },
    ...linksMenuItems,
  ];

  return { sidebar, global };
};
