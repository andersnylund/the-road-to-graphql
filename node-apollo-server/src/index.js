import express from 'express';
import helmet from 'helmet';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(helmet());

const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User {
    id: ID!
    username: String!
    age: Int
  }
`;

let users = {
  1: {
    id: '1',
    username: 'Anders Nylund',
  },
  2: {
    id: '2',
    username: 'John Doe',
  },
};

const resolvers = {
  Query: {
    users: () => Object.values(users),
    me: (parent, args, { me }) => me,
    user: (parent, { id }) => users[id],
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
