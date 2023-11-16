import React from 'react';
import classes from './PageLayout.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTestQuery } from '../../queries/useTestQuery';

const instance = axios.create({
  baseURL: '/api/', // This path will be proxied in development
});

export const fetchData = () => {
  return instance.get('/v1/');
};

export const PageLayout = () => {
  const { data: testData, isLoading } = useTestQuery();
  if (isLoading) return <div>Loading...</div>;
  console.log('testData', testData);

  return (
    <div>
      <h1 className={classes.heading}>Dialogporten Frontend</h1>
      <h2>Current BFF version: {testData?.bffVersion}</h2>
      <p>{testData?.message}</p>
      <Link to={`test`}>Go to React Router Test Page</Link>
      <br />
    </div>
  );
};
