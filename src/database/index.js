import Sequelize from 'sequelize';

import User from '../app/models/User';
import Students from '../app/models/Student';
import Memberships from '../app/models/Membership';
import ActiveMemberships from '../app/models/ActiveMembership';
import Checkins from '../app/models/Checkin';

import databaseConfig from '../config/database';

const models = [User, Students, Memberships, ActiveMemberships, Checkins];

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
