import React, { useState, useContext } from 'react';
import { createContext } from 'react';
import { createPortal } from 'react-dom';
import styles from './bottomDrawer.module.css';

type ContextType = { current: any } | any;
const BottomDrawerContext = createContext<ContextType>({});

/*
 *  Use this to show stuff in the bottom drawer
 **/
export const BottomDrawer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useContext(BottomDrawerContext);

  if (typeof ref == 'undefined') {
    return <div></div>;
  }

  return createPortal(children, ref);
};

/*
 *	Wrap the body to support BottomDrawer, it'll be used as a portal target
 **/
export const BottomDrawerContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ref, setRef] = useState<HTMLDivElement | null>();

  return (
    <>
      <BottomDrawerContext.Provider value={ref}>{children}</BottomDrawerContext.Provider>
      <div className={styles.bottomDrawer} ref={(newRef) => setRef(newRef)}></div>
    </>
  );
};
