import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const users = await User.findAll({
      order: [['id', 'DESC']],
      include: [
        {
          model: File,
          as: 'foto',
        },
      ],
    });
    return res.json(users);
  }
}

export default new UserController();
