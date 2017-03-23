import BaseModel from './base';

class UserRepository extends BaseModel {
  static get tableName() {
    return 'user_repository';
  }

  static get jsonSchema() {
    return {
      required: [
        'userId',
        'repositoryId',
      ],
      properties: {
        id: { type: 'integer' },
        userId: { type: 'string' },
        repositoryId: { type: 'string' },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: `${__dirname}/users`,
        join: {
          from: 'user_repository.userId',
          to: 'users.id',
        },
      },
      repository: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: `${__dirname}/repositories`,
        join: {
          from: 'user_repository.repositoryId',
          to: 'repositories.id',
        },
      },
    };
  }
}

export default UserRepository;
