import React from 'react';
import classes from './PageLayout.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useTestQuery } from '../../queries/useTestQuery';
import { dialogMock } from '../../mockData/dialogMock';

const instance = axios.create({
  baseURL: '/api/', // This path will be proxied in development
});

export const fetchData = () => {
  return instance.get('/v1/');
};

export const PageLayout = () => {
  // const { data: testData, isLoading } = useTestQuery();
  const [data, setData] = React.useState(null);
  const [err, setErr] = React.useState(null);
  const dialogData = dialogMock;

  return (
    <div>
      <h1 className={classes.heading}>Dialogporten Frontend</h1>
      {/* <h2>Current BFF version: {testData?.bffVersion}</h2> */}
      {/* <p>{testData?.message}</p> */}
      <Link to={`test`}>Go to React Router Test Page</Link>
      <button
        onClick={() =>
          fetch('http://localhost:3000/auth/protected', {
            method: 'GET', // or 'POST'
            credentials: 'include', // This is important for cookies
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              // Other headers can go here
            },
            // No body for GET requests
          })
            .then((response) => response.json())
            .then((d) => {
              // Handle your data here
              console.log(d);
              setData(d.message?.toString?.());
            })
            .catch((error) => {
              // Handle errors here
              console.error('Error:', error);
              setErr(error.toString());
            })
        }
      >
        Fetch data
      </button>
      <br />
      {!!data && <p>Successfully fetched data, got: {data}</p>}
      {!!err && <p>Error fetching data: {err}</p>}
    </div>
  );
};
