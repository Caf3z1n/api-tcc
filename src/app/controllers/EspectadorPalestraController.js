import { isAfter } from 'date-fns';

import User from '../models/User';
import Palestra from '../models/Palestra';
import EspectadorPalestra from '../models/EspectadorPalestra';
import Evento from '../models/Evento';

class EspectadorPalestraController {
  async create(req, res) {
    const espectador = await User.findByPk(req.userId);

    if (espectador.nivel !== 2) {
      return res.status(400).json({
        erro: 'É necessário ser um espectador para se inscrever em uma palestra',
      });
    }

    const { id_palestra } = req.body;

    const palestra = await Palestra.findByPk(id_palestra);

    if (!palestra) {
      return res.status(400).json({ erro: 'Palestra não encontrada' });
    }

    if (palestra.ativo !== true || isAfter(new Date(), palestra.data_fim)) {
      return res
        .status(400)
        .json({ erro: 'Palestra indisponivel para inscrição' });
    }

    const exists = await EspectadorPalestra.findOne({
      where: {
        id_espectador: req.userId,
        id_palestra,
      },
    });

    if (exists) {
      return res
        .status(400)
        .json({ erro: 'Usuário já está inscrito nessa palestra' });
    }

    const espectador_palestra = await EspectadorPalestra.create({
      id_espectador: req.userId,
      id_palestra,
      tempo_assistido: 0,
    });

    return res.json(espectador_palestra);
  }

  async index(req, res) {
    const palestras = await EspectadorPalestra.findAll({
      order: [['id', 'DESC']],
      where: {
        id_espectador: req.userId,
      },
      include: [
        {
          model: Palestra,
          as: 'palestra',
          include: [
            {
              model: Evento,
              as: 'evento',
            },
          ],
        },
      ],
    });
    return res.json(palestras);
  }
}

export default new EspectadorPalestraController();
