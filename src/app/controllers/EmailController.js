import nodemailer from 'nodemailer';

import User from '../models/User';

class EmailController {
  async store(req, res) {
    const { email } = req.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return res.json({ erro: 'Email não encontrado' });
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

    const novaSenha = generateRandomString(8);

    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'tcc-ads@outlook.com', // generated ethereal user
        pass: 'tccads2023', // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: 'Athon Webnar <tcc-ads@outlook.com>', // sender address
      to: user.email, // list of receivers
      subject: 'Mudança de senha Athon Webnar', // Subject line
      text: `Olá ${user.nome}, sua nova senha para login é: ${novaSenha}
      você pode muda-la a qualquer momento clicando em meu perfil`, // plain text body
    });

    user.update({
      password: novaSenha,
    });

    return res.json({ info });
  }
}

export default new EmailController();
