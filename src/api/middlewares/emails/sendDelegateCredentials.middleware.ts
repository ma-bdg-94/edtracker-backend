import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
const {
  NODEMAILER_AUTH_MAIL,
  NODEMAILER_AUTH_PASSWORD,
  NODEMAILER_PORT,
  NODEMAILER_HOST,
} = process.env;

async function sendDelegateCredentials(
  email: any,
  password: any,
  firstNameAr: any,
  firstNameLa: any,
  lastNameAr: any,
  lastNameLa: any
) {
  try {
    const transporter = nodemailer.createTransport(
      smtpTransport({
        host: NODEMAILER_HOST,
        port: parseInt(NODEMAILER_PORT!),
        secure: false,
        auth: {
          user: NODEMAILER_AUTH_MAIL!,
          pass: NODEMAILER_AUTH_PASSWORD!,
        },
      })
    );

    var mailOptions = {
      from: NODEMAILER_AUTH_MAIL!,
      to: email,
      subject:
        "Delegate Credentials - Données du Délégué - معلومات المندوب ",
      html: `<div style="font-family: Arial, sans-serif; font-size: 16px; text-align: center;">
      <p style="font-weight: bold; margin-bottom: 10px">Greetings Mr. ${firstNameLa} ${lastNameLa},</p>
      <p>You are welcome to Edtracker Community.<br /> We are pleased to provide you your authentication credentials,
      <br /><b>Email:</b><span>${email}</span>
      <br /><b>Password:</b><span>${password}</span>
      <br /><span>Best Regards</span>

      <hr />
      <div style="font-family: Arial, sans-serif; font-size: 16px; text-align: center;">
      <p style="font-weight: bold; margin-bottom: 10px">Greetings Mr. ${firstNameLa} ${lastNameLa},</p>
      <p>Bienvenue à la communauté Edtracker.<br /> Ravis de vous servir par vos données d'authentification,
      <br /><b>Email:</b><span>${email}</span>
      <br /><b>Mot de Passe:</b><span>${password}</span>
      <br /><span>Cordialement</span>
      <hr />
      <p style="font-weight: bold; margin-bottom: 10px">أهلا وسهلا، ${lastNameAr} ${firstNameAr}</p>
      <p>مرحبا بكم في مجتمع إدتراكر<br /> سعيدون بإعطائكم بيانات الدخول لحسابكم
      <br /><b>البريد الإلكتروني:</b><span>${email}</span>
      <br /><b>كلمة السر:</b><span>${password}</span>
      <p>.دمتم بود</p>
    </div>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (error: any) {
    console.log(error);
  }
}

export default sendDelegateCredentials;
