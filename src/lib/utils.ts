import transporter from "./mailer";

function generateValidationCode(length = 6): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

async function sendValidationCodeEmail(email: string, code: string) {
    await transporter.sendMail({
        from: `"SGERP Support" <no-reply@cfe.mx>`,
        to: email,
        subject: "Código de Validación para Recuperación de Contraseña",
        text: `Tu código de validación es: ${code}`,
        html: `<p>Tu código de validación es: <strong>${code}</strong></p>`,
    });

    console.log(`Correo enviado a ${email}`);
}

export { generateValidationCode, sendValidationCodeEmail };
