import http from 'http';
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
  const token = req.headers.bearer;

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
  context: async ({ req, connection }) => {
    if (connection) {
      return {
        models,
      };
    }
    if (req) {
      const me = await getMe(req);
      return {
        models,
        me,
        secret: process.env.SECRET,
      };
    }
  },
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: 'andersnylund',
      email: 'anders.nylund@example.com',
      password: 'andersnylund',
      role: 'ADMIN',
      messages: [
        {
          text: 'blah blah',
          createdAt: date.setSeconds(date.getSeconds() + 1),
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
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: 'Published a complete...',
          createdAt: date.setSeconds(date.getSeconds() + 1),
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
    createUsersWithMessages(new Date());
  }

  httpServer.listen({ port: 8000 }, () => {
    // eslint-disable-next-line no-console
    console.log('Apollo Server on http://localhost:8000/graphql');
  });
});
