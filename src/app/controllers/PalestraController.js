import { isBefore, isAfter, differenceInMinutes } from 'date-fns';

import Palestra from '../models/Palestra';
import EspectadorPalestra from '../models/EspectadorPalestra';
import Evento from '../models/Evento';
import File from '../models/File';
import User from '../models/User';

class PalestraController {
  async update(req, res) {
    const { palestraId } = req.params;

    const palestra = await Palestra.findByPk(palestraId);

    if (!palestra) {
      return res.status(400).json({ erro: 'Palestra não encontrada' });
    }

    if (
      (palestra.id_palestrante !== req.userId && req.userNivel !== 0) ||
      palestra.ativo === null
    ) {
      return res
        .status(400)
        .json({ erro: 'Usuário não permissão para alterar essa palestra' });
    }

    palestra.update(req.body);

    return res.json(palestra);
  }

  async index(req, res) {
    const { paginaAtual = 1, itensPorPagina = 10 } = req.query;

    const palestras = await Palestra.findAll({
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina,
      order: [['id', 'DESC']],
      where: {
        id_palestrante: req.userId,
      },
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

    const quantidadeTotalDeItens = await Palestra.count({
      where: {
        id_palestrante: req.userId,
      },
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

  async delete(req, res) {
    const { palestraId } = req.params;

    const palestra = await Palestra.findByPk(palestraId);

    if (!palestra) {
      return res.status(400).json({ erro: 'Palestra não encontrada' });
    }

    if (
      (palestra.id_palestrante !== req.userId && req.userNivel !== 0) ||
      palestra.ativo !== null
    ) {
      return res
        .status(400)
        .json({ erro: 'Usuário não permissão para alterar essa palestra' });
    }

    palestra.update({
      ativo: false,
    });

    return res.json({ message: 'Palestra cancelada com sucesso', palestra });
  }

  async create(req, res) {
    const { palestraId } = req.params;
    const { link } = req.body;

    const palestra = await Palestra.findByPk(palestraId);

    if (!palestra) {
      return res.status(400).json({ erro: 'Palestra não encontrada' });
    }

    if (palestra.id_palestrante !== req.userId && req.userNivel !== 0) {
      return res
        .status(400)
        .json({ erro: 'Usuário não permissão para alterar essa palestra' });
    }

    palestra.update({
      link,
    });

    return res.json(palestra);
  }

  async show(req, res) {
    const { palestraId } = req.params;

    const espectadorPalestra = await EspectadorPalestra.findOne({
      where: {
        id_espectador: req.userId,
        id_palestra: palestraId,
      },
      include: [
        {
          model: Palestra,
          as: 'palestra',
          include: [
            {
              model: User,
              as: 'palestrante',
            },
          ],
        },
      ],
    });

    if (!espectadorPalestra) {
      return res
        .status(400)
        .json({ erro: 'Relação espectador e palestra não foi encontrado' });
    }

    const agora = new Date();

    const depois = isAfter(agora, espectadorPalestra.palestra.data_inicio);
    const antes = isBefore(agora, espectadorPalestra.palestra.data_fim);

    if (!depois || !antes) {
      return res.json({
        tempo_contabilizado: 0,
        espectadorPalestra,
      });
    }

    if (!espectadorPalestra.ultimo_acesso) {
      await espectadorPalestra.update({
        ultimo_acesso: agora,
      });

      return res.json({
        message:
          'Primeiro acesso da palestra, começando a contar o tempo assistido...',
        espectadorPalestra,
      });
    }

    const diferenca = differenceInMinutes(
      agora,
      espectadorPalestra.ultimo_acesso
    );

    if (diferenca === 0) {
      return res.json({
        message:
          'Nenhum minuto adicionado ao contador de tempo assistido da palestra',
        espectadorPalestra,
      });
    }

    const { tempo_assistido } = espectadorPalestra;
    if (diferenca <= 5) {
      const novo_tempo = tempo_assistido + diferenca;

      await espectadorPalestra.update({
        tempo_assistido: novo_tempo,
        ultimo_acesso: agora,
      });
    } else {
      const novo_tempo = tempo_assistido + 5;

      await espectadorPalestra.update({
        tempo_assistido: novo_tempo,
        ultimo_acesso: agora,
      });
    }

    return res.json({
      tempo_contabilizado: diferenca <= 5 ? diferenca : 5,
      espectadorPalestra,
    });
  }
}

export default new PalestraController();
