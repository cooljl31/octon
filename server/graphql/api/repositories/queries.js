import { User, Repository } from '../../../models';

export default {
  /**
   * @description Return user repositories list
   **/
  async repositories(_, __, { userId }) {
    if (!userId) {
      throw new Error('auth');
    }
    const user = await User.query().where('id', userId).first();
    return user.$relatedQuery('repositories').orderBy('name');
  },
};
