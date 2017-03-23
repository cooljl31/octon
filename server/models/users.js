import BaseModel from './base';

class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      required: [
        'avatar',
        'email',
        'dailyNotification',
        'weeklyNotification',
        'githubId',
        'githubUsername',
        'githubAccessToken',
      ],
      properties: {
        id: { type: 'integer' },
        avatar: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        dailyNotification: { type: 'boolean' },
        weeklyNotification: { type: 'boolean' },
        githubId: { type: 'number' },
        githubUsername: { type: 'string', minLength: 1, maxLength: 255 },
        githubAccessToken: { type: 'string', minLength: 1, maxLength: 255 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      repositories: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: `${__dirname}/repositories`,
        join: {
          from: 'users.id',
          through: {
            from: 'user_repository.userId',
            to: 'user_repository.repositoryId',
          },
          to: 'repositories.id',
        },
      },
    };
  }
}

export default User;
