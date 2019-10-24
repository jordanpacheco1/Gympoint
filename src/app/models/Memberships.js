import Sequelize, { Model } from 'sequelize';

class Memberships extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );
  }
}

export default Memberships;
