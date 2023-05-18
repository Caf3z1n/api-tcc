import PdfPrinter from 'pdfmake';
import fs from 'fs';

import EspectadorPalestra from '../models/EspectadorPalestra';
import Palestra from '../models/Palestra';
import User from '../models/User';
import Certificado from '../models/Certificado';

class CertificadoController {
  async store(req, res) {
    const { id } = req.params;

    const certificado_exists = await Certificado.findOne({
      where: {
        id_espectador_palestra: id,
      },
    });

    if (certificado_exists) {
      return res.json({ certificado: certificado_exists });
    }

    const espectador_palestra = await EspectadorPalestra.findOne({
      where: {
        id,
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
        {
          model: User,
          as: 'espectador',
        },
      ],
    });

    if (!espectador_palestra) {
      return res
        .status(400)
        .json({ error: 'Espectador_palestra não encontrado' });
    }

    const fonts = {
      Helvetica: {
        normal: 'Helvetica',
        bold: 'Helvetica-Bold',
        italics: 'Helvetica-Oblique',
        bolditalics: 'Helvetica-BoldOblique',
      },
    };
    const printer = new PdfPrinter(fonts);

    const tempo = espectador_palestra.tempo_assistido;
    let duracao = '';
    if (tempo >= 60) {
      let horas = 0;
      let i = tempo;
      for (i; i >= 60; i -= 60) {
        horas += 1;
      }

      duracao = `${horas} hora(s) e ${i} minuto(s)`;
    } else {
      duracao = `${tempo} minuto(s)`;
    }

    const generateRandomString = (num) => {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result1 = '';
      const charactersLength = characters.length;
      for (let i = 0; i < num; i += 1) {
        result1 += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }

      return result1;
    };

    const nome_certificado = generateRandomString(32);

    const docDefinitions = {
      defaultStyle: { font: 'Helvetica', alignment: 'center', lineHeight: 1.5 },
      pageSize: 'A4',
      pageMargins: [120, 60, 120, 60],
      pageOrientation: 'landscape',
      background: {
        image: 'public/fundo.png',
        width: 845,
      },
      content: [
        { text: 'Certificamos que', style: 'certificamos' },
        {
          text: String(espectador_palestra.espectador.nome).toUpperCase(),
          style: 'nome',
        },
        {
          text: [
            { text: 'Participou da palestra ' },
            {
              text: espectador_palestra.palestra.nome,
              bold: true,
            },
            { text: ' proferida por ' },
            { text: espectador_palestra.palestra.palestrante.nome, bold: true },
            { text: '. A palestra teve uma carga horária de ' },
            { text: duracao, bold: true },
          ],
          style: 'texto',
        },
      ],
      footer: {
        text: [{ text: 'Validação: ' }, { text: nome_certificado, bold: true }],
        style: 'footer',
      },
      styles: {
        certificamos: {
          marginTop: 120,
          fontSize: 26,
        },
        nome: {
          marginTop: 30,
          fontSize: 30,
          bold: true,
        },
        texto: {
          marginTop: 30,
          fontSize: 18,
          width: 40,
        },
        footer: {
          marginTop: 30,
          fontSize: 12,
          alignment: 'left',
          marginLeft: 30,
        },
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinitions);

    pdfDoc.pipe(
      fs.createWriteStream(`tmp/certificados/${nome_certificado}.pdf`)
    );

    pdfDoc.end();

    const certificado = await Certificado.create({
      id_espectador_palestra: id,
      nome: nome_certificado,
    });

    return res.json({ certificado, espectador_palestra });
  }

  async index(req, res) {
    const { nome_certificado } = req.params;

    const certificado = await Certificado.findOne({
      where: {
        nome: nome_certificado,
      },
    });

    if (!certificado) {
      return res.json({ message: 'Certificado inválido' });
    }

    return res.json({ message: 'Certificado válido', certificado });
  }
}

export default new CertificadoController();
