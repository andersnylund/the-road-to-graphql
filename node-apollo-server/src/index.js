import express from 'express';
import helmet from 'helmet';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import schema from './schema';
import resolvers from './resolvers';
import models, { sequelize } from './models';

dotenv.config();
const isDevelopment = process.env.NODE_ENV === 'development';

const app = express();
app.use(cors());
app.use(helmet());

const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your sessions expired. Sign in again.');
    }
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  debug: isDevelopment,
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace('SequelizeValidationError: ', '')
      .replace('Validation error: ', '');

    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);
    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'andersnylund',
      email: 'anders.nylund@example.com',
      password: 'andersnylund',
      role: 'ADMIN',
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
      email: 'john.doe@example.com',
      password: 'johndoe',
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

sequelize.sync({ force: isDevelopment }).then(async () => {
  if (isDevelopment) {
    createUsersWithMessages();
  }

  app.listen({ port: 8000 }, () => {
    // eslint-disable-next-line no-console
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});
