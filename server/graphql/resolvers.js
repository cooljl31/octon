import { merge } from 'lodash';
import UserQueries from './api/users/queries';
import UserResolvers from './api/users/resolvers';

const resolvers = merge(
  {
    Query: merge(
      UserQueries,
    ),
  },
  UserResolvers,
);

export default resolvers;
