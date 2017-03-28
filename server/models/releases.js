import BaseModel from './base';
import Repository from './repositories';

class Release extends BaseModel {
  static get tableName() {
    return 'releases';
  }

  static get jsonSchema() {
    return {
      required: ['refId', 'name', 'htmlUrl', 'type', 'publishedAt'],
      properties: {
        id: { type: 'integer' },
        refId: { type: 'string', minLength: 1, maxLength: 255 },
        name: { type: 'string', minLength: 1, maxLength: 255 },
        htmlUrl: { type: 'string', minLength: 1, maxLength: 255 },
        // TODO enum
        type: { type: 'string', minLength: 1, maxLength: 255 },
        publishedAt: { type: 'dateTime' },
      },
    };
  }

  static get relationMappings() {
    return {
      repository: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: Repository,
        join: {
          from: 'releases.repositoryId',
          to: 'repositories.id',
        },
      },
    };
  }
}

export default Release;
