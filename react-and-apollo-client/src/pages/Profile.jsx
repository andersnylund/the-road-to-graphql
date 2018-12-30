import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import RepositoryList from '../components/RepositoryList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { REPOSITORY_FRAGMENT } from '../components/RepositoryItem';

const GET_REPOSITORIES_OF_USER = gql`
  query($cursor: String) {
    viewer {
      repositories(
        first: 5
        orderBy: { direction: DESC, field: STARGAZERS }
        after: $cursor
      ) {
        edges {
          node {
            ...repository
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
      login
      name
    }
  }

  ${REPOSITORY_FRAGMENT}
`;

const Profile = () => (
  <Query query={GET_REPOSITORIES_OF_USER} notifyOnNetworkStatusChange>
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }

      const { viewer } = data;

      if (loading && !viewer) {
        return <Loading />;
      }

      return (
        <RepositoryList
          loading={loading}
          repositories={viewer.repositories}
          fetchMore={fetchMore}
        />
      );
    }}
  </Query>
);

export default Profile;
