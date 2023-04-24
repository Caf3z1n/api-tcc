import { Op } from 'sequelize';

import Evento from '../models/Evento';

class HomeEventosController {
  async index(req, res) {
    const eventos_ativos = await Evento.findAll({
      where: {
        data_fim: { [Op.gte]: new Date() },
      },
      order: [['data_inicio']],
    });

    const eventos_passados = await Evento.findAll({
      where: {
        data_fim: { [Op.lt]: new Date() },
      },
      order: [['data_inicio', 'DESC']],
    });
    return res.json({ eventos_ativos, eventos_passados });
  }
}

export default new HomeEventosController();
