import transporter from "./mailer";
import path from "path";

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
        from: `"Soporte SGERP" <no-reply@sgerp.com>`,
        to: email,
        subject: "Código de Validación para Recuperación de Contraseña",
        text: `Tu código de validación es: ${code}`,
        html: `
      <div style="text-align: center;">
        <img src="cid:logo" alt="SGERP" width="150" />
        <p>Tu código de validación es: <strong>${code}</strong></p>
      </div>
    `,
        attachments: [
            {
                filename: "sgerp-logo.png",
                path: path.join(__dirname, "../assets/sgerp-logo.png"),
                cid: "logo",
            },
        ],
    });
}

export { generateValidationCode, sendValidationCodeEmail };
