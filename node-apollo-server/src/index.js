import express from 'express';
import helmet from 'helmet';
import { ApolloServer, gql } from 'apollo-server-express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(helmet());

const schema = gql`
  type Query {
    me: User
  }

  type User {
    username: String!
    age: Int!
  }
`;

const resolvers = {
  Query: {
    me: () => ({
      username: 'Anders Nylund',
      age: 24,
    }),
  },
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

server.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: 8000 }, () => {
  // eslint-disable-next-line no-console
  console.log('Apollo Server on http://localhost:8000/graphql');
});
