import { makeExecutableSchema } from 'graphql-tools';
import User from './api/users/schema';
import Repository from './api/repositories/schema';
import Release from './api/releases/schema';
import resolvers from './resolvers';

const Query = `
  type Query {
    # Get the current user
    currentUser: User
    # Get user repositories list
    repositories: [Repository]!
  }
`;

const SchemaDefinition = `
  schema {
    query: Query
  }
`;

export default makeExecutableSchema({
  typeDefs: [SchemaDefinition, Query, User, Repository, Release],
  resolvers,
});
