import { Model } from 'objection';

class BaseModel extends Model {
  /* static get defaultEagerAlgorithm() {
    return Model.JoinEagerAlgorithm;
  } */

  $beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default BaseModel;
