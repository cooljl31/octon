import BaseModel from './base';
import Release from './releases';

class Repository extends BaseModel {
  static get tableName() {
    return 'repositories';
  }

  static get jsonSchema() {
    return {
      required: ['refId', 'name', 'avatar', 'htmlUrl', 'type'],
      properties: {
        id: { type: 'integer' },
        refId: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        avatar: { type: 'string', minLength: 1, maxLength: 255 },
        htmlUrl: { type: 'string', minLength: 1, maxLength: 255 },
        // TODO enum
        type: { type: 'string', minLength: 1, maxLength: 255 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
    return {
      releases: {
        relation: BaseModel.HasManyRelation,
        modelClass: Release,
        join: {
          from: 'repositories.id',
          to: 'releases.repositoryId',
        },
      },
    };
  }
}

export default Repository;
