import React from 'react';
import classes from './PageLayout.module.css';
import { Link } from 'react-router-dom';

export const PageLayout = () => {
  return (
    <div>
      <h1 className={classes.heading}>PageLayout</h1>
      <Link to={`test`}>Go to Test Page</Link>
    </div>
  );
};
