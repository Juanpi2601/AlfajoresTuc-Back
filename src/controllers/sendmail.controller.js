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

        const mailOptions = {
            from: `${name} santillanfacundo43@gmail.com`,
            to: email,
            subject: 'Testeando Nodemailer',
            text: mensaje
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        res.status(200).json({ message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
};
