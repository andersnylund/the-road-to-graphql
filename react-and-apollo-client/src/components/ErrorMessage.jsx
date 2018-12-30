import React from 'react';

const ErrorMessage = ({ error }) => {
  return (
    <div>
      <small>{error.toString()}</small>
    </div>
  );
};

export default ErrorMessage;
