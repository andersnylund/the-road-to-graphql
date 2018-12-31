import express from 'express';
import helmet from 'helmet';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';
import uuidv4 from 'uuid/v4';
import { identity } from 'rxjs';

const app = express();
app.use(cors());
app.use(helmet());

const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User

    messages: [Message!]!
    message(id: ID!): Message!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean!
  }

  type User {
    id: ID!
    username: String!
    age: Int
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Anders Nylund',
    messageIds: [1],
  },
  2: {
    id: '2',
    username: 'John Doe',
    messageIds: [2],
  },
};

let messages = {
  1: {
    id: '1',
    text: 'Hello World',
    userId: '1',
  },
  2: {
    id: '2',
    text: 'Bye World',
    userId: '2',
  },
};

const resolvers = {
  Query: {
    users: () => Object.values(users),
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
    messages: () => Object.values(messages),
    message: (parent, { id }) => messages[id],
  },

  Mutation: {
    createMessage: (parent, { text }, { me }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId: me.id,
      };

      messages[id] = message;
      users[me.id].messageIds.push(id);

      return message;
    },

    deleteMessage: (parent, { id }) => {
      const message = messages[id];
      if (!message) {
        return false;
      }
      delete messages[id];
      users[message.userId].messageIds = users[
        message.userId
      ].messageIds.filter(messageId => messageId !== id);
      return true;
    },
  },

  User: {
    messages: user =>
      Object.values(messages).filter(message => message.userId === user.id),
  },

  Message: {
    user: message => users[message.userId],
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    me: users[1],
  },
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  // eslint-disable-next-line no-console
  console.log('Apollo Server on http://localhost:8000/graphql');
});
