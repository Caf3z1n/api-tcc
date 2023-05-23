import { differenceInMinutes } from 'date-fns';

import Palestra from '../models/Palestra';
import EspectadorPalestra from '../models/EspectadorPalestra';
import User from '../models/User';

class AprovarCertificadosController {
  async index(req, res) {
    const { idPalestra } = req.params;
    const palestra = await Palestra.findOne({
      where: {
        id: idPalestra,
      },
    });

    if (palestra.id_palestrante !== req.userId) {
      return res
        .status(400)
        .json({ error: 'usuário não é o palestrante dessa palestra' });
    }

    const tempo_minino =
      (Math.abs(differenceInMinutes(palestra.data_inicio, palestra.data_fim)) /
        100) *
      75;

    const espectadores = await EspectadorPalestra.findAll({
      where: {
        id_palestra: palestra.id,
      },
      include: [
        {
          model: User,
          as: 'espectador',
        },
      ],
    });

    const espectadores_final = [];
    espectadores.forEach((espectador) => {
      if (espectador.tempo_assistido < tempo_minino) {
        espectadores_final.push(espectador);
      }
    });

    return res.json({ tempo_minino, palestra, espectadores_final });
  }

  async store(req, res) {
    const { espectadorPalestraId } = req.params;

    const espectador_palestra = await EspectadorPalestra.findOne({
      where: {
        id: espectadorPalestraId,
      },
      include: [
        {
          model: Palestra,
          as: 'palestra',
        },
      ],
    });

    const tempo_completo = Math.abs(
      differenceInMinutes(
        espectador_palestra.palestra.data_inicio,
        espectador_palestra.palestra.data_fim
      )
    );

    await espectador_palestra.update({
      tempo_assistido: tempo_completo,
    });

    return res.json({ espectador_palestra });
  }
}

export default new AprovarCertificadosController();
