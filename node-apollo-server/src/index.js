import express from 'express';
import helmet from 'helmet';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

const app = express();
app.use(cors());
app.use(helmet());

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.User.findByLogin('andersnylund'),
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const eraseDatabaseOnSync = true;

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'andersnylund',
      messages: [
        {
          text: 'blah blah',
        },
      ],
    },
    { include: [models.Message] }
  );

  await models.User.create(
    {
      username: 'jdoe',
      messages: [
        {
          text: 'Happy to release...',
        },
        {
          text: 'Published a complete...',
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  app.listen({ port: 8000 }, () => {
    // eslint-disable-next-line no-console
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});
