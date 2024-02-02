import React from 'react';
import { Link } from 'react-router-dom';

export const TestPage = () => {
  return (
    <div>
      <h1>Test page</h1>
      <Link to={`/`}>Go to Root</Link>
    </div>
  );
};
