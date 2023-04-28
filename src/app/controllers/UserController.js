import User from '../models/User';
import File from '../models/File';

class UserController {
  async index(req, res) {
    const { paginaAtual = 1, itensPorPagina = 10 } = req.query;

    const users = await User.findAll({
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina,
      order: [['nivel']],
      include: [
        {
          model: File,
          as: 'foto',
        },
      ],
    });

    const quantidadeTotalDeItens = await User.count();

    return res.json({
      users,
      paginacao: {
        paginaAtual,
        itensPorPagina,
        quantidadeTotalDeItens,
      },
    });
  }
}

export default new UserController();
