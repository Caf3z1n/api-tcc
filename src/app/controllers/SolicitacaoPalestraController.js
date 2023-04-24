import * as Yup from 'yup';

import Palestra from '../models/Palestra';
import Evento from '../models/Evento';
import User from '../models/User';
import File from '../models/File';

class SolicitacaoPalestraController {
  async store(req, res) {
    const schema = Yup.object().shape({
      nome: Yup.string().required(),
      descricao: Yup.string().required(),
      local: Yup.string(),
      data_inicio: Yup.date().required(),
      data_fim: Yup.date().required(),
      link: Yup.string(),
      tipo: Yup.number().required(),
      id_evento: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const {
      nome,
      descricao,
      local = null,
      data_inicio,
      data_fim,
      link = null,
      tipo,
      id_evento,
    } = req.body;

    const evento = await Evento.findByPk(id_evento);

    if (!evento) {
      return res.status(400).json({ erro: 'Evento não encontrado' });
    }

    const palestra = await Palestra.create({
      nome,
      descricao,
      local,
      data_inicio,
      data_fim,
      link,
      tipo,
      id_evento,
      id_palestrante: req.userId,
    });

    return res.json(palestra);
  }

  async index(req, res) {
    const palestras = await Palestra.findAll({
      where: {
        ativo: null,
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

    return res.json(palestras);
  }

  async update(req, res) {
    const { palestraId } = req.params;

    const palestra = await Palestra.findByPk(palestraId);

    if (!palestra) {
      return res.status(400).json({ erro: 'Palestra não localizada' });
    }

    const { criar = true } = req.body;

    if (criar === false) {
      await palestra.update({
        ativo: false,
      });
      return res.json({
        message: 'Criação de palestra negada com sucesso',
        palestra,
      });
    }
    await palestra.update({
      ativo: true,
    });

    return res.json(palestra);
  }
}

export default new SolicitacaoPalestraController();
