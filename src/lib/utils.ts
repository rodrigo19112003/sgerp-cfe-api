import UserRoles from "../types/enums/user_roles";
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

async function sendValidationCodeEmail(data: { email: string; code: string }) {
    const { email, code } = data;
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

async function sendUserCredentialsEmail(userInformation: {
    employeeNumber: string;
    fullName: string;
    email: string;
    password: string;
    userRoles: UserRoles[];
}) {
    const { employeeNumber, fullName, email, password, userRoles } =
        userInformation;
    const rolesList = userRoles.map((role) => `• ${role}`).join("<br>");

    await transporter.sendMail({
        from: `"Soporte SGERP" <no-reply@sgerp.com>`,
        to: email,
        subject: "Tus credenciales de acceso al Sistema SGERP",
        text: `Hola ${fullName},

        Has sido registrado en el Sistema de Gestión de Entrega Recepción de Puestos con los siguientes roles:
        ${userRoles.join(", ")}

        Tus credenciales son:
        RTT/RPE: ${employeeNumber}
        Contraseña: ${password}

        Por seguridad, te recomendamos cambiar tu contraseña antes de tu primer inicio de sesión.

        Atentamente,
        Equipo de Soporte SGERP`,
        html: `
      <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
        <img src="cid:logo" alt="SGERP" width="150" style="margin-bottom: 20px;" />
        <p>Hola <strong>${fullName}</strong>,</p>
        <p>Has sido registrado en el <strong>Sistema de Gestión de Entrega Recepción de Puestos</strong> con los siguientes roles:</p>
        <p>${rolesList}</p>
        <p>Tus credenciales de acceso son:</p>
        <p>RTT/RPE: <strong>${employeeNumber}</strong><br>
        Contraseña: <strong>${password}</strong></p>
        <p>Por seguridad, te recomendamos cambiar tu contraseña antes de tu primer inicio de sesión.</p>
        <br>
        <p>Atentamente,<br>Equipo de Soporte SGERP</p>
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

async function sendDeletedUserNotificationEmail(userInformation: {
    employeeNumber: string;
    fullName: string;
    email: string;
}) {
    const { employeeNumber, fullName, email } = userInformation;

    await transporter.sendMail({
        from: `"Soporte SGERP" <no-reply@sgerp.com>`,
        to: email,
        subject: "Notificación de eliminación de tu cuenta en SGERP",
        text: `Hola ${employeeNumber} - ${fullName},

        Queremos informarte que tu cuenta en el Sistema de Gestión de Entrega Recepción de Puestos ha sido eliminada.

        A partir de este momento ya no podrás acceder al sistema y toda la información asociada a tu cuenta ha sido eliminada de manera permanente.

        Atentamente,
        Equipo de Soporte SGERP`,
        html: `
      <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
        <img src="cid:logo" alt="SGERP" width="150" style="margin-bottom: 20px;" />
        <p>Hola <strong>${employeeNumber} - ${fullName}</strong>,</p>
        <p>Queremos informarte que tu cuenta en el <strong>Sistema de Gestión de Entrega Recepción de Puestos</strong> ha sido eliminada.</p>
        <p>A partir de este momento ya no podrás acceder al sistema y toda tu información asociada ha sido eliminada de manera permanente.</p>
        <br>
        <p>Atentamente,<br>Equipo de Soporte SGERP</p>
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

async function sendUpdatedUserInformationEmail(userInformation: {
    employeeNumber: string;
    fullName: string;
    email: string;
    userRoles: UserRoles[];
}) {
    const { employeeNumber, fullName, email, userRoles } = userInformation;
    const rolesList = userRoles.map((role) => `• ${role}`).join("<br>");

    await transporter.sendMail({
        from: `"Soporte SGERP" <no-reply@sgerp.com>`,
        to: email,
        subject: "Actualización de tus datos en el Sistema SGERP",
        text: `Hola ${fullName},

        Tus datos han sido actualizados en el Sistema de Gestión de Entrega Recepción de Puestos. Tus roles ahora son:
        ${userRoles.join(", ")}

        Tus credenciales son:
        RTT/RPE: ${employeeNumber}
        Contraseña: *No cambió, ingresa con la que tienes actualmente*

        Atentamente,
        Equipo de Soporte SGERP`,
        html: `
      <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
        <img src="cid:logo" alt="SGERP" width="150" style="margin-bottom: 20px;" />
        <p>Hola <strong>${fullName}</strong>,</p>
        <p>Tus datos han sido actualizados en el <strong>Sistema de Gestión de Entrega Recepción de Puestos</strong>. Tus roles ahora son:</p>
        <p>${rolesList}</p>
        <p>Tus credenciales de acceso son:</p>
        <p>RTT/RPE: <strong>${employeeNumber}</strong><br>
        Contraseña: <strong>*No cambió, ingresa con la que tienes actualmente*</strong></p>
        <br>
        <p>Atentamente,<br>Equipo de Soporte SGERP</p>
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

async function sendDeletedDeliveryReceptionEmail(data: {
    sendingWorker: string;
    receivingWorker: string;
    email: string;
}) {
    const { sendingWorker, receivingWorker, email } = data;

    await transporter.sendMail({
        from: `"Soporte SGERP" <no-reply@sgerp.com>`,
        to: email,
        subject:
            "Notificación de eliminación de entrega-recepción de puesto en el Sistema SGERP",
        text: `Estimado usuario,

        Se informa que la entrega registrada entre los siguientes trabajadores ha sido eliminada del Sistema de Gestión de Entrega Recepción de Puestos:

        Trabajador que entrega: ${sendingWorker}
        Trabajador que recibe: ${receivingWorker}

        Atentamente,
        Equipo de Soporte SGERP`,
        html: `
      <div style="text-align: center; font-family: Arial, sans-serif; color: #333;">
        <img src="cid:logo" alt="SGERP" width="150" style="margin-bottom: 20px;" />
        <p>Estimado(a) usuario(a),</p>
        <p>
          Se informa que la entrega registrada entre los siguientes trabajadores ha sido 
          <strong>eliminada</strong> del 
          <strong>Sistema de Gestión de Entrega Recepción de Puestos</strong>:
        </p>
        <p style="text-align: left; display: inline-block; margin-top: 10px;">
          • <strong>Trabajador que entrega:</strong> ${sendingWorker}<br>
          • <strong>Trabajador que recibe:</strong> ${receivingWorker}
        </p>
        <br>
        <p>Atentamente,<br><strong>Equipo de Soporte SGERP</strong></p>
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

export {
    generateValidationCode,
    sendValidationCodeEmail,
    sendUserCredentialsEmail,
    sendDeletedUserNotificationEmail,
    sendUpdatedUserInformationEmail,
    sendDeletedDeliveryReceptionEmail,
};
