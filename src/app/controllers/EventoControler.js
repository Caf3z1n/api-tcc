/* eslint-disable array-callback-return */
import * as Yup from 'yup';
import { startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';

import Evento from '../models/Evento';
import Palestra from '../models/Palestra';
import User from '../models/User';

class EventoController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      descricao: Yup.string().required(),
      local: Yup.string().required(),
      data_inicio: Yup.date().required(),
      data_fim: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { nome, descricao, local, data_inicio, data_fim } = req.body;

    const evento = await Evento.create({
      nome,
      descricao,
      local,
      data_inicio: startOfDay(new Date(data_inicio)),
      data_fim: endOfDay(new Date(data_fim)),
    });

    return res.json(evento);
  }

  async index(req, res) {
    const { paginaAtual = 1, itensPorPagina = 10, ativo = 'false' } = req.query;

    const where = {};
    let order = [['id', 'DESC']];

    if (ativo === 'true') {
      where.data_fim = { [Op.gte]: new Date() };
      order = [['data_inicio']];
    }

    const eventos = await Evento.findAll({
      limit: itensPorPagina,
      offset: (paginaAtual - 1) * itensPorPagina,
      where,
      order,
      include: [
        {
          model: Palestra,
          as: 'palestras',
          order: [['data_inicio']],
          include: [
            {
              model: User,
              as: 'palestrante',
            },
          ],
        },
      ],
    });

    const quantidadeTotalDeItens = await Evento.count({
      where,
    });

    /*
    eventos.map((evento) => {
      if (evento.palestras.length >= 1) {
        const palestrasAtivas = [];
        evento.palestras.map((palestra) => {
          if (palestra.ativo === true) {
            palestrasAtivas.push(palestra);
          }
        });
        console.warn(palestrasAtivas);
      }
    });
    */

    const eventosNovo = [];
    eventos.map((evento) => {
      if (evento.palestras.length >= 1) {
        const palestras = [];
        evento.palestras.map((palestra) => {
          if (palestra.ativo === true) {
            palestras.push(palestra);
          }
        });
        evento.palestras = palestras;
        eventosNovo.push({
          id: evento.id,
          nome: evento.nome,
          descricao: evento.descricao,
          local: evento.local,
          data_inicio: evento.data_inicio,
          data_fim: evento.data_fim,
          createdAt: evento.createdAt,
          updatedAt: evento.updatedAt,
          palestras,
        });
      } else {
        eventosNovo.push(evento);
      }
    });

    return res.json({
      eventos: eventosNovo,
      paginacao: {
        paginaAtual,
        itensPorPagina,
        quantidadeTotalDeItens,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string(),
      descricao: Yup.string(),
      local: Yup.string(),
      data_inicio: Yup.date(),
      data_fim: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { eventoId } = req.params;

    const evento = await Evento.findByPk(eventoId);

    if (!evento) {
      return res.status(400).json({ error: 'Evento não encontrado' });
    }

    await evento.update(req.body);

    return res.json(evento);
  }

  async delete(req, res) {
    const { eventoId } = req.params;

    const evento = await Evento.findByPk(eventoId);

    if (!evento) {
      return res.json({ error: 'Evento não encontrado' });
    }

    await evento.destroy();

    return res.json({
      message: 'Evento excluido com sucesso',
      evento,
    });
  }
}

export default new EventoController();
