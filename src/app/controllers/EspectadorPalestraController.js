import { isAfter } from 'date-fns';

import Palestra from '../models/Palestra';
import EspectadorPalestra from '../models/EspectadorPalestra';
import Evento from '../models/Evento';
import User from '../models/User';
import File from '../models/File';

class EspectadorPalestraController {
  async create(req, res) {
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
    const { paginaAtual = 1, itensPorPagina = 10 } = req.query;

    const palestras = await Palestra.findAll({
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina,
      order: [['data_inicio']],
      include: [
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
        {
          model: Evento,
          as: 'evento',
        },
        {
          model: EspectadorPalestra,
          as: 'espectador_palestra',
          where: {
            id_espectador: req.userId,
          },
        },
      ],
    });

    const quantidadeTotalDeItens = await Palestra.count({
      include: [
        {
          model: EspectadorPalestra,
          as: 'espectador_palestra',
          where: {
            id_espectador: req.userId,
          },
        },
      ],
    });

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

export default new EspectadorPalestraController();
