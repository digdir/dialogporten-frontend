import styles from "./inboxItems.module.css";

export interface InboxItemsProps {
  children: React.ReactNode;
}

/**
 * A container component for displaying a list of inbox items. It serves as a wrapper
 * for individual `InboxItem` components, ensuring they are styled and organized collectively.
 * This component primarily handles the layout of its children inbox items.
 *
 * @component
 * @param {Object} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The child components to be rendered within the container.
 * Typically, these are `InboxItem` components, but can include any React nodes.
 * @returns {JSX.Element} A div element wrapping the children in a styled manner,
 * according to the `inboxItems` CSS class defined in `inboxItems.module.css`.
 *
 * @example
 * <InboxItems>
 *   <InboxItem {...inboxItemProps1} />
 *   <InboxItem {...inboxItemProps2} />
 *   <InboxItem {...inboxItemProps3} />
 * </InboxItems>
 */

export const InboxItems = ({ children }: InboxItemsProps) => {
  return <div className={styles.inboxItems}>{children}</div>;
};