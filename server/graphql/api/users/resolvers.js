import { property } from 'lodash';

export default {
  User: {
    id: property('id'),
    avatar: property('avatar'),
    email: property('email'),
    dailyNotification: property('dailyNotification'),
    weeklyNotification: property('weeklyNotification'),
  },
};
