/* eslint-disable array-callback-return */
import { Op } from 'sequelize';
import Palestra from '../models/Palestra';
import User from '../models/User';
import File from '../models/File';
import Evento from '../models/Evento';
import EspectadorPalestra from '../models/EspectadorPalestra';

class PalestrasDisponiveisController {
  async index(req, res) {
    const { paginaAtual = 1, itensPorPagina = 10 } = req.query;

    const palestras = await Palestra.findAll({
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina,
      order: [['data_inicio']],
      where: {
        ativo: true,
        data_fim: { [Op.gte]: new Date() },
      },
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
      ],
    });

    const espectadorPalestras = await EspectadorPalestra.findAll({
      where: {
        id_espectador: req.userId,
      },
    });

    const palestrasAtivas = [];
    palestras.map((ficar) => {
      const existe = espectadorPalestras.find(
        (sair) => sair.id_palestra === ficar.id
      );

      if (!existe) {
        palestrasAtivas.push(ficar);
      }
    });

    return res.json({
      palestras: palestrasAtivas,
      paginacao: {
        paginaAtual,
        itensPorPagina,
        quantidadeTotalDeItens: palestrasAtivas.length,
      },
    });
  }

  async show(req, res) {
    const palestra = await EspectadorPalestra.findAll({
      where: {
        id_espectador: req.userId,
      },
      include: [
        {
          model: Palestra,
          as: 'palestra',
          where: {
            data_inicio: { [Op.lte]: new Date() },
            data_fim: { [Op.gte]: new Date() },
            ativo: true,
            link: { [Op.ne]: '' },
          },
        },
      ],
    });
    return res.json(palestra);
  }
}

export default new PalestrasDisponiveisController();
