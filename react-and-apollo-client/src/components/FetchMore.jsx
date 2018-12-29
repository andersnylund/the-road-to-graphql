import React from 'react';
import Button from './Button';

const FetchMore = ({
  variables,
  updateQuery,
  fetchMore,
  children,
}) => (
  <div>
    <Button
      secondary
      onClick={() => fetchMore({ variables, updateQuery })}
    >
      More
      {` ${children}`}
    </Button>
  </div>
);

export default FetchMore;
