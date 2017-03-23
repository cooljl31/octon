import { User } from '../../../models';

export default {
  /**
   * @description Return the current logged user
   **/
  async currentUser(_, __, { userId }) {
    if (userId) {
      const user = await User.query().where('id', userId).first();
      return user;
    }
    return null;
  },
};
