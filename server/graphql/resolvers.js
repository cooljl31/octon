import { merge } from 'lodash';
import UserQueries from './api/users/queries';
import UserResolvers from './api/users/resolvers';
import RepositoryQueries from './api/repositories/queries';
import RepositoryResolvers from './api/repositories/resolvers';

const resolvers = merge(
  {
    Query: merge(UserQueries, RepositoryQueries),
  },
  UserResolvers,
  RepositoryResolvers,
);

export default resolvers;
