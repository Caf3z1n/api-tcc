import * as Yup from 'yup';

import SolicitacaoPalestrante from '../models/SolicitacaoPalestrante';
import User from '../models/User';
import File from '../models/File';

class SolicitacaoPalestranteController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required(),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
      id_foto: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email } = req.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(400).json({ error: 'Nome de usuário já cadastrado' });
    }

    const palestranteExists = await SolicitacaoPalestrante.findOne({
      where: {
        email,
      },
    });

    if (palestranteExists) {
      return res.status(400).json({ error: 'Nome de usuário já cadastrado' });
    }

    const palestrante = await SolicitacaoPalestrante.create(req.body);

    return res.json(palestrante);
  }

  async update(req, res) {
    const { palestranteId } = req.params;

    const temp_palestrante = await SolicitacaoPalestrante.findByPk(
      palestranteId
    );

    if (!temp_palestrante) {
      return res
        .status(400)
        .json({ error: 'Id do palestrante não encontrado' });
    }

    const { criar = true } = req.body;

    if (criar === false) {
      temp_palestrante.destroy();
      return res.json({
        Mensagem: 'Criação de palestrante negada com sucesso',
        palestrante: temp_palestrante,
      });
    }

    const { nome, email, password_hash, id_foto } = temp_palestrante;

    const palestrante = await User.create({
      nome,
      email,
      password_hash,
      id_foto,
      nivel: 1,
    });

    await temp_palestrante.destroy();

    return res.json(palestrante);
  }

  async index(req, res) {
    const { paginaAtual = 1, itensPorPagina = 50 } = req.query;

    const palestrantes = await SolicitacaoPalestrante.findAll({
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina,
      order: [['id', 'DESC']],
      include: [
        {
          model: File,
          as: 'foto',
        },
      ],
    });

    const quantidadeTotalDeItens = await SolicitacaoPalestrante.count();

    return res.json({
      palestrantes,
      paginacao: {
        paginaAtual,
        itensPorPagina,
        quantidadeTotalDeItens,
      },
    });
  }
}

export default new SolicitacaoPalestranteController();
