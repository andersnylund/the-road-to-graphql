import React from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import RepositoryList from './RepositoryList';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { REPOSITORY_FRAGMENT } from './RepositoryItem';

const GET_CURRENT_USER = gql`
  {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
      ) {
        edges {
          node {
            ...repository
          }
        }
      }
      login
      name
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

const Profile = ({ data, loading, error }) => {
  if (error) {
    return <ErrorMessage error={error} />;
  }

  const { viewer } = data;

  if (loading || !viewer) {
    return <Loading />;
  }

  return <RepositoryList repositories={viewer.repositories} />;
};

export default graphql(GET_CURRENT_USER)(Profile);
