import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import User from '../models/User';
import File from '../models/File';
import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().required(),
      password: Yup.string().required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const { id, nome, nivel } = user;

    return res.json({
      profile: {
        id,
        nome,
        email,
        nivel,
      },
      token: jwt.sign({ id, nivel }, authConfig.secret),
    });
  }

  async index(req, res) {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: 'foto',
        },
      ],
    });

    const { id, nome, email, nivel } = user;

    let foto = null;
    if (user.foto) {
      foto = {
        url: user.foto.url,
        id: user.foto.id,
      };
    }
    return res.json({
      id,
      nome,
      email,
      nivel,
      foto,
    });
  }
}

export default new SessionController();
