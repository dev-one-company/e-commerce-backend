const { User } = require('../models/User');

class GetUserInformationService {
  async execute(userId) {
    const result = await User.findByPk(userId);

    if (result) {
      return result.toJSON();
    }

    return new Error('User does not exists');
  }
}

module.exports = { GetUserInformationService };
