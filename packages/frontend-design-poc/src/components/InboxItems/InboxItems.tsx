import styles from "./inboxItems.module.css";

export interface InboxItemsProps {
  children: React.ReactNode;
}

export const InboxItems = ({ children }: InboxItemsProps) => {
  return <div className={styles.inboxItems}>{children}</div>;
};
