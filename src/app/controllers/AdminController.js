import * as Yup from 'yup';

import User from '../models/User';

class AdminController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { nome, email, password } = req.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const espectador = await User.create({
      nome,
      email,
      password,
      nivel: 0,
    });

    return res.json(espectador);
  }
}

export default new AdminController();
