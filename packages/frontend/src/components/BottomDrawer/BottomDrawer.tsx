import type React from 'react';
import { useState, useContext } from 'react';
import { createContext } from 'react';
import { createPortal } from 'react-dom';
import styles from './bottomDrawer.module.css';

type ContextType = { current: HTMLDivElement | null };
const BottomDrawerContext = createContext<ContextType>({ current: null });

/*
 *  Use this to show stuff in the bottom drawer
 **/
export const BottomDrawer: React.FC<{ children: React.ReactNode | null }> = ({ children }) => {
  const ref = useContext(BottomDrawerContext);

  if (ref.current === null) {
    return null;
  }

  return createPortal(children, ref.current);
};

/*
 *	Wrap the body to support BottomDrawer, it'll be used as a portal target
 **/
export const BottomDrawerContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  return (
    <>
      <BottomDrawerContext.Provider value={{ current: ref }}>{children}</BottomDrawerContext.Provider>
      <div className={styles.bottomDrawer} ref={(newRef) => setRef(newRef)} />
    </>
  );
};
