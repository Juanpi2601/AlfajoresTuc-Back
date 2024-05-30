import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';

export const sendMail = async (req, res) => {
    const { name, email, mensaje } = req.body;

    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "santillanfacundo43@gmail.com",
                pass: "slfzmzpidqymjeux",
            },
        });

        const mailOptionsConsultante = {
            from: "FS <santillanfacundo43@gmail.com>",
            to: email,
            subject: 'Consulta recibida exitosamente',
            text: `Hola ${name},\n\nGracias por tu consulta. Hemos recibido tu mensaje y nos pondremos en contacto contigo pronto.\n\nSaludos,\n[FS]`
        };

        const mailOptionsPropietario = {
            from: `${name} ${email}`,
            to: "santillanfacundo43@gmail.com",
            subject: 'Nueva consulta registrada',
            text: `Se ha recibido una nueva consulta de ${name} (${email}).\n\nMensaje: ${mensaje}`
        };

        await transporter.sendMail(mailOptionsConsultante);
        await transporter.sendMail(mailOptionsPropietario);

        res.status(200).json({ message: 'Consulta registrada exitosamente. Se ha enviado un correo de confirmación.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al enviar los correos' });
    }
};

const generateRandomPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomPassword = '';
    for (let i = 0; i < 10; i++) {
      randomPassword += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomPassword;
};
  
export const forgotPasswordController = async (req, res) => {
    const { email, name } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const randomPassword = generateRandomPassword();
  
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
      user.password = hashedPassword;
      await user.save();
  
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: 'santillanfacundo43@gmail.com',
          pass: 'slfzmzpidqymjeux',
        },
      });
  
      const mailOptions = {
        from: 'santillanfacundo43@gmail.com',
        to: `${name} ${email}`,
        subject: 'Contraseña Temporal',
        text: `Hola ${user.name},\n\nTu nueva contraseña temporal es: ${randomPassword}\n\nPor favor, inicia sesión con esta contraseña y cámbiala lo antes posible.\n\nSaludos,\nTu Aplicación`,
      };
  
      await transporter.sendMail(mailOptions);
  
      res.status(200).json({ message: 'Se ha enviado un correo electrónico con una contraseña temporal' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al enviar el correo electrónico con la contraseña temporal' });
    }
};