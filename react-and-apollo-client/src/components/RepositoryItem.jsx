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

const CHANGE_SUBSCRIPTION_OF_REPOSITORY = gql`
  mutation($id: ID!, $subscriptionState: SubscriptionState!) {
    updateSubscription(
      input: { subscribableId: $id, state: $subscriptionState }
    ) {
      subscribable {
        id
        viewerSubscription
      }
    }
  }
`;

const updateAddSubscribtion = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.watchers.totalCount + 1;

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

const updateRemoveSubscribtion = (
  client,
  {
    data: {
      updateSubscription: {
        subscribable: { id },
      },
    },
  }
) => {
  const repository = client.readFragment({
    id: `Repository:${id}`,
    fragment: REPOSITORY_FRAGMENT,
  });

  const totalCount = repository.watchers.totalCount - 1;

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
          <Mutation mutation={STAR_REPOSITORY} variables={{ id }}>
            {(addStar, { data, loading, error }) => (
              <Button onClick={addStar}>
                {`${stargazers.totalCount} `}
                Star
              </Button>
            )}
          </Mutation>
        ) : (
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
        )}
      </div>
      <div>
        {viewerSubscription === 'SUBSCRIBED' ? (
          <Mutation
            mutation={CHANGE_SUBSCRIPTION_OF_REPOSITORY}
            variables={{ id, subscriptionState: 'UNSUBSCRIBED' }}
            update={updateRemoveSubscribtion}
          >
            {(changeSubscription, { data, loading, error }) => (
              <Button onClick={changeSubscription}>
                {`${watchers.totalCount} Unwatch`}
              </Button>
            )}
          </Mutation>
        ) : (
          <Mutation
            mutation={CHANGE_SUBSCRIPTION_OF_REPOSITORY}
            variables={{ id, subscriptionState: 'SUBSCRIBED' }}
            update={updateAddSubscribtion}
          >
            {(changeSubscription, { data, loading, error }) => (
              <Button onClick={changeSubscription}>
                {`${watchers.totalCount} Watch`}
              </Button>
            )}
          </Mutation>
        )}
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
