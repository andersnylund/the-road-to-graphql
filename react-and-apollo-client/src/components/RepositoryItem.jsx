import React from 'react';
import { Header } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

import Link from './Link';
import Button from './Button';

export const REPOSITORY_FRAGMENT = gql`
  fragment repository on Repository {
    id
    name
    url
    descriptionHTML
    primaryLanguage {
      name
    }
    owner {
      login
      url
    }
    stargazers {
      totalCount
    }
    viewerHasStarred
    watchers {
      totalCount
    }
    viewerSubscription
  }
`;

const ADD_STAR = gql`
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

const REMOVE_STAR = gql`
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

const CHANGE_SUBSCRIPTION_OF_REPOSITORY = gql`
  mutation($id: ID!, $viewerSubscription: SubscriptionState!) {
    updateSubscription(
      input: { subscribableId: $id, state: $viewerSubscription }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const VIEWER_SUBSCRIPTIONS = {
  SUBSCRIBED: 'SUBSCRIBED',
  UNSUBSCRIBED: 'UNSUBSCRIBED',
};

const isWatch = viewerSubscription =>
  viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED;

const updateWatch = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id, viewerSubscription },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  let { totalCount } = repository.watchers;
  totalCount =
    viewerSubscription === VIEWER_SUBSCRIPTIONS.SUBSCRIBED
      ? totalCount + 1
      : totalCount - 1;

  client.writeFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
    data: {
      ...repository,
      watchers: {
        ...repository.watchers,
        totalCount,
      },
    },
  });
};

const RepositoryItem = ({
  id,
  name,
  url,
  descriptionHTML,
  primaryLanguage,
  owner,
  stargazers,
  watchers,
  viewerSubscription,
  viewerHasStarred,
}) => (
  <div>
    <div>
      <Header as="h2">
        <Link href={url}>{name}</Link>
      </Header>
      <div>
        {!viewerHasStarred ? (
          <Mutation
            mutation={ADD_STAR}
            variables={{ id }}
            optimisticResponse={{
              addStar: {
                __typename: 'AddStarPayload',
                starrable: {
                  __typename: 'Repository',
                  id,
                  viewerHasStarred: true,
                  stargazers: {
                    __typename: 'StargazerConnection',
                    totalCount: stargazers.totalCount + 1,
                  },
                },
              },
            }}
          >
            {(addStar, { data, loading, error }) => (
              <Button onClick={addStar}>
                {`${stargazers.totalCount} `}
                Star
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={REMOVE_STAR}
            variables={{ id }}
            optimisticResponse={{
              removeStar: {
                __typename: 'RemoveStarPayload',
                starrable: {
                  __typename: 'Repository',
                  id,
                  viewerHasStarred: false,
                  stargazers: {
                    __typename: 'StargazerConnection',
                    totalCount: stargazers.totalCount - 1,
                  },
                },
              },
            }}
          >
            {(removeStar, { data, loading, error }) => (
              <Button onClick={removeStar}>
                {`${stargazers.totalCount} `}
                Unstar
              </Button>
            )}
          </Mutation>
        )}
      </div>
      <div>
        <Mutation
          mutation={CHANGE_SUBSCRIPTION_OF_REPOSITORY}
          variables={{
            id,
            viewerSubscription: isWatch(viewerSubscription)
              ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
              : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
          }}
          optimisticResponse={{
            updateSubscription: {
              __typename: 'Mutation',
              subscribable: {
                __typename: 'Repository',
                id,
                viewerSubscription: isWatch(viewerSubscription)
                  ? VIEWER_SUBSCRIPTIONS.UNSUBSCRIBED
                  : VIEWER_SUBSCRIPTIONS.SUBSCRIBED,
              },
            },
          }}
          update={updateWatch}
        >
          {(updateSubscription, { data, loading, error }) => (
            <Button onClick={updateSubscription}>
              {`${watchers.totalCount} ${
                isWatch(viewerSubscription) ? 'Unwatch' : 'Watch'
              }`}
            </Button>
          )}
        </Mutation>
      </div>
    </div>
    <div>
      <div dangerouslySetInnerHTML={{ __html: descriptionHTML }} />
      <div>
        <div>
          {primaryLanguage && (
            <span>
              Language:
              {` ${primaryLanguage.name}`}
            </span>
          )}
        </div>
        <div>
          {owner && (
            <span>
              Owner:
              <a href={owner.url}>{` ${owner.login}`}</a>
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default RepositoryItem;
