import React from 'react';
import classes from './PageLayout.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getTest2, useTestQuery } from '../../queries/useTestQuery';

const instance = axios.create({
  baseURL: '/api/', // This path will be proxied in development
});

export const fetchData = () => {
  return instance.get('/v1/');
};

export const PageLayout = () => {
  const { data: testData, isLoading } = useTestQuery('Mr. Altinn Bruker');
  const currentDate = new Date();
  const dateTimeString = currentDate.toLocaleString();
  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className={classes.heading}>PageLayout</h1>
      <h2>Azure Test page IAC Bicep Timestamp: {dateTimeString}</h2>
      <button onClick={() => getTest2()}>Create user in db</button>
      <Link to={`test`}>Go to React Router Test Page</Link>
      <br />
      ID: {testData?.id}, Message: {testData?.message}
    </div>
  );
};
