import React from 'react';
import gql from 'graphql-tag';
import { graphql, Mutation } from 'react-apollo';

import Button from './Button';

const STAR_REPOSITORY = gql`
  mutation($id: ID!) {
    addStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const REMOVE_STAR_FROM_REPOSITORY = gql`
  mutation($id: ID!) {
    removeStar(input: { starrableId: $id }) {
      starrable {
        id
        viewerHasStarred
        stargazers {
          totalCount
        }
      }
    }
  }
`;

const AddStar = graphql(STAR_REPOSITORY)(
  ({ mutate, data, loading, error, stargazers, id }) => (
    <Button
      onClick={() => mutate({ variables: { starrableId: id } })}
    >
      {`${stargazers.totalCount} `}
      Star
    </Button>
  )
);

const StarButton = ({ viewerHasStarred, stargazers, id }) => {
  if (!viewerHasStarred) {
    return <AddStar stargazers={stargazers} id={id} />;
  }
  return (
    <Mutation
      mutation={REMOVE_STAR_FROM_REPOSITORY}
      variables={{ id }}
    >
      {(removeStar, { data, loading, error }) => (
        <Button onClick={removeStar}>
          {`${stargazers.totalCount} `}
          Unstar
        </Button>
      )}
    </Mutation>
  );
};

export default StarButton;
