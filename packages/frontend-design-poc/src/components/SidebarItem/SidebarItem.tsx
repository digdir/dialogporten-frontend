import React from 'react';
import styles from './sidebarItem.module.css';
import cx from 'classnames';

export type SidebarItemProps = {
	displayText: string;
	label: string;
	icon: JSX.Element;
	count?: number;
	url: string;
	isInbox?: boolean;
	isButton?: boolean;
	isCompany?: boolean;
	type?: 'primary' | 'secondary';
};

/**
 * SidebarItem is a navigational component designed to be used as part of a sidebar menu.
 * It displays an item with an icon and text, and optionally a counter badge if a count is provided.
 * The component can be styled differently if it represents an inbox item or a button.
 *
 * @component
 * @param {string} props.displayText - The text to display for the sidebar item.
 * @param {string} props.label - The accessible label for the sidebar item, used by screen readers.
 * @param {JSX.Element} props.icon - The icon to display next to the sidebar item text.
 * @param {number} [props.count] - Optional count to display as a badge, indicating the number of items or notifications.
 * @param {string} props.url - The URL that the sidebar item links to.
 * @param {boolean} [props.isInbox=false] - Flag indicating whether the item is an inbox item, which may change styling.
 * @param {boolean} [props.isButton=false] - Flag indicating whether the item should behave as a button, including keyboard interaction.
 * @param {boolean} [props.isCompany=false] - Flag indicating whether the item should use company design or not.
 * @param {'primary' | 'secondary'} [props.type='primary'] - Choose between primary and secondary design.
 * @returns {JSX.Element} The SidebarItem component.
 *
 * @example
 * <SidebarItem
 *   displayText="Innboks"
 *   label="Gå til innboks"
 *   icon={<InboxFillIcon />}
 *   count={3}
 *   url="/innboks"
 *   isInbox
 * />
 *
 * @example
 * <SidebarItem
 *   displayText="Sendt"
 *   label="Gå til sendte elementer"
 *   icon={<FileCheckmarkIcon />}
 *   count={5}
 *   url="/sendt"
 * />
 */

export const SidebarItem: React.FC<SidebarItemProps> = ({
	displayText,
	label,
	icon,
	count,
	url,
	isInbox,
	isButton,
	isCompany,
	type = 'primary',
}) => {
	const ariaTextCounter = count
		? `${count} uleste ${isInbox ? 'meldinger' : 'elementer'} i ${displayText}`
		: displayText;
	return (
		<a href={url} className={styles.link} aria-label={label}>
			<div
				className={cx(styles.sidebarItem, {
					[styles.isButton]: isButton,
					[styles.isCompany]: isCompany,
				})}
			>
				<div className={styles.iconAndText}>
					<span
						className={cx(styles.icon, {
							[styles.isInbox]: isInbox,
							[styles.isCompany]: isCompany,
							[styles.isPrimary]: type === 'primary',
						})}
						aria-hidden="true"
					>
						{icon}
					</span>
					<span className={styles.displayText}>{displayText}</span>
				</div>

				{!!count && (
					<div
						className={cx(styles.counter, {
							[styles.redCounter]: isInbox,
						})}
						aria-label={ariaTextCounter}
					>
						{count}
					</div>
				)}
			</div>
		</a>
	);
};
