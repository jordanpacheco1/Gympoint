import Sequelize from 'sequelize';

import User from '../app/models/User';
import Students from '../app/models/Students';
import Memberships from '../app/models/Memberships';

import databaseConfig from '../config/database';

const models = [User, Students, Memberships];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
