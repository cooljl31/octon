import 'babel-polyfill';
import dotenv from 'dotenv';
import next from 'next';
import Knex from 'knex';
import { Model } from 'objection';
import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import connectSessionKnex from 'connect-session-knex';
import { graphqlExpress, graphiqlConnect } from 'graphql-server-express';
import nunjucks from 'nunjucks';
import logger from 'winston';
import 'isomorphic-fetch';
import { checkEnv } from './utils';
import passport from './passport';
import graphqlSchema from './graphql/schema';

// Configure env variables
dotenv.config();
checkEnv();
process.env.GITHUB_REDIRECT_URL = process.env.GITHUB_REDIRECT_URL || '/auth/github/callback';
process.env.PORT = process.env.PORT || 3000;

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Connect to database
  const knex = Knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });

  // TODO Model url validator
  Model.knex(knex);

  const server = express();
  nunjucks.configure('ressources/templates', {
    autoescape: true,
    express: server,
  });

  const KnexSessionStore = connectSessionKnex(session);
  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      store: new KnexSessionStore({ knex, createtable: true }),
      resave: false,
      saveUninitialized: false,
    }),
  );
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(bodyParser.json());
  server.use(express.static('public'));

  passport(server);

  // Graphql endpoint
  server.use(
    '/graphql',
    bodyParser.json(),
    graphqlExpress(req => ({
      schema: graphqlSchema,
      context: {
        userId: req.user ? req.user.id : null,
      },
    })),
  );

  // Enable graphiql in development
  if (process.env.NODE_ENV !== 'production') {
    server.use(
      '/graphiql',
      graphiqlConnect({
        endpointURL: '/graphql',
      }),
    );
  }

  server.get('*', (req, res) => {
    req.session.redirectTo = req.url;
    if (!req.isAuthenticated()) {
      res.render('index.html');
    } else {
      handle(req, res);
    }
  });

  server.listen(process.env.PORT, () => {
    logger.info(`app started on port ${process.env.PORT}`);
  });
});
