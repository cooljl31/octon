import BaseModel from './base';
import User from './users';
import Repository from './repositories';

class UserRepository extends BaseModel {
  static get tableName() {
    return 'user_repository';
  }

  static get jsonSchema() {
    return {
      required: ['userId', 'repositoryId'],
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
        modelClass: User,
        join: {
          from: 'user_repository.userId',
          to: 'users.id',
        },
      },
      repository: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Repository,
        join: {
          from: 'user_repository.repositoryId',
          to: 'repositories.id',
        },
      },
    };
  }
}

export default UserRepository;
