import 'dotenv/config';
import ApolloClient, { gql } from 'apollo-boost';
import 'cross-fetch/polyfill';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
      },
    });
  },
});

const REPOSITORY_FRAGMET = gql`
  fragment RepositoryFields on Repository {
    name
    url
    stargazers {
      totalCount
    }
  }
`;

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query($organization: String!) {
    organization(login: $organization) {
      name
      url
      repositories(last: 5, orderBy: { field: STARGAZERS, direction: DESC }) {
        edges {
          node {
            ...RepositoryFields
          }
        }
      }
    }
  }
  ${REPOSITORY_FRAGMET}
`;

const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = gql`
  mutation RemoveStar($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

client
  .mutate({
    mutation: REMOVE_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    },
  })
  .then(res => console.log(JSON.stringify(res, null, 2)))
  .catch(console.error);
