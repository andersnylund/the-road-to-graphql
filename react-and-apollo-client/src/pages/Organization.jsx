import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { REPOSITORY_FRAGMENT } from '../components/RepositoryItem';
import RepositoryList from '../components/RepositoryList';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organizationName: String!, $cursor: String) {
    organization(login: $organizationName) {
      repositories(first: 5, after: $cursor) {
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
    }
  }
  ${REPOSITORY_FRAGMENT}
`;

const Organization = ({ organizationName }) => (
  <Query
    query={GET_REPOSITORIES_OF_ORGANIZATION}
    variables={{ organizationName }}
    skip={organizationName === ''}
    notifyOnNetworkStatusChange
  >
    {({ data, loading, error, fetchMore }) => {
      if (error) {
        return <ErrorMessage error={error} />;
      }
      const { organization } = data;
      if (loading && !organization) {
        return <Loading />;
      }
      return (
        <RepositoryList
          loading={loading}
          repositories={organization.repositories}
          fetchMore={fetchMore}
          entry="organization"
        />
      );
    }}
  </Query>
);

export default Organization;
