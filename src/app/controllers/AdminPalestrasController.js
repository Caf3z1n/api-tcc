import Palestra from '../models/Palestra';
import Evento from '../models/Evento';
import User from '../models/User';
import File from '../models/File';

class AdminPalestrasController {
  async index(req, res) {
    const { paginaAtual = 1, itensPorPagina = 10 } = req.query;

    const palestras = await Palestra.findAll({
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina,
      order: [['data_inicio', 'DESC']],
      include: [
        {
          model: Evento,
          as: 'evento',
        },
        {
          model: User,
          as: 'palestrante',
          include: [
            {
              model: File,
              as: 'foto',
            },
          ],
        },
      ],
    });

    const quantidadeTotalDeItens = await Palestra.count();

    return res.json({
      palestras,
      paginacao: {
        paginaAtual,
        itensPorPagina,
        quantidadeTotalDeItens,
      },
    });
  }
}

export default new AdminPalestrasController();
