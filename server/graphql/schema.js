import { makeExecutableSchema } from 'graphql-tools';
import User from './api/users/schema';
import resolvers from './resolvers';

const Query = `
  type Query {
    # Get the current user
    currentUser: User
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
  }
`;

export default makeExecutableSchema({
  typeDefs: [
    SchemaDefinition, Query,
    User,
  ],
  resolvers,
});
