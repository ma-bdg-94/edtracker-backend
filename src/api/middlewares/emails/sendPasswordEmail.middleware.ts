import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";
const {
  NODEMAILER_AUTH_MAIL,
  NODEMAILER_AUTH_PASSWORD,
  NODEMAILER_PORT,
  NODEMAILER_HOST,
} = process.env;

async function sendPasswordEmail(
  email: any,
  token: any,
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
        "Password Recovery - Récupération du Mot de Passe - إستعادة كلمة السر",
      html: `<div style="font-family: Arial, sans-serif; font-size: 16px; text-align: center;">
      <p style="font-weight: bold; margin-bottom: 10px">Greetings ${firstNameLa} ${lastNameLa},</p>
      <p>We regret that you have forgotten your password.<br /> Unfortunately due to our security policies that prohibits storing customer passwords in our databases, <br /> regret to inform you that your password can <span style="font-weight: bold;">never</span> be recovered.</p>
      <p>Alternatively, by clicking in the link below, you can generate a new password.</p>
      <p>Best Regards,</p>
      <hr />
      <p style="font-weight: bold; margin-bottom: 10px">Bienvenue, ${lastNameLa} ${firstNameLa}.</p>
      <p>Nous regrettons que vous avez oublié votre mot de passe.<br /> Malheureusement, en raison de nos politiques de sécurité qui interdisent de stocker les mots de passe des clients dans nos bases de données, <br /> regret de vous informer que votre mot de passe ne peut <span style="font-weight: bold;">jamais</span> être récupéré.</p>
      <p>Alternativement, en cliquant sur le lien ci-dessous, vous pouvez générer un nouveau mot de passe.</p>
      <p>Cordialement,</p>
      <hr />
      <p style="font-weight: bold; margin-bottom: 10px">أهلا وسهلا، ${lastNameAr} ${firstNameAr}</p>
      <p>نشعر بالأسف حقا لعملنا بكونكم نسيتم كلمة السر<br /> مع الأسف، وفقا لسياستنا الأمنية التي تمنع تسجيل كلمات سر الحرفاء في قاعدة البيانات، فإنه لا يمكن استرجاع كلمة السر أبدا".</p>
      <p>كحل بديل، يمكن تسجيل كلمة سر جديدة وذلك بالضغط على الرابط أسفله</p>
      <p>.دمتم بود</p>
      <hr />
      <p style="margin-bottom: 20px">
        <a
          style="color: #007bff"
          href="http://localhost:3001/reset-password/${token}"
          >Click Here to Generate New Password</a
        >
      </p>
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

export default sendPasswordEmail;
