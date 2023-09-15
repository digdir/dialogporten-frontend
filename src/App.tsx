import React from 'react';
import classes from './App.module.css';

interface AppProps {
  title?: string;
  onClick?: () => void;
}

export const App = ({ title, onClick }: AppProps) => {
  return (
    <div>
      <h1 className={classes.heading}>{title || "Hello"}</h1>
      <button onClick={onClick}>Send inn</button>
      <label htmlFor="hallo">Hallo</label>
      <input type="text" id="hallo" />
    </div>
  );
};
