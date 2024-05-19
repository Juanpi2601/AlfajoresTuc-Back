import nodemailer from 'nodemailer';

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