const nodemailer = require('nodemailer')

class MailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    })
  }

  async sendActivationmail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: `Активация аккаунта на ${process.env.API_URL}`,
      text: '',
      html:
        `
          <html>
<head>
	<title>Активация аккаунта</title>
	<meta name="viewport" content="width=400">
	<style type="text/css">img {
      border: 0 none;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }

    a img {
      border: 0 none;
    }

    #outlook a {
      padding: 0;
    }
	</style>
</head>
<body cellpadding="0" cellspacing="0" style="padding: 0px; margin: 0px; border: 0px; width: 100%; text-size-adjust: 100%; background: rgb(239, 239, 239); cursor: auto;">
<div style="font-size:0px"></div>

<table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; border-spacing:0; margin:0; border:0;">
	<tbody>
		<tr>
			<td style="padding: 20px 0; margin: 0; background: #efefef; ">
			<table cellpadding="0" cellspacing="0" style="width:100%; border-collapse:collapse; border-spacing:0; margin:0 auto; border:0;">
				<tbody>
					<tr>
						<td style="padding: 0 10px;">
						<table cellpadding="0" cellspacing="0" style="width:100%; max-width: 600px; border-collapse:collapse; border-spacing:0; margin:0 auto; border:0; background: #fff; border-radius: 15px;">
							<tbody>
								<tr>
									<td style="padding: 15px; margin: 0;">
									<p style="padding: 0; margin: 0 0 30px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-weight: bold; font-size: 22px; text-align: center;">Активация аккаунта на data-code-info.ru</p>

									<p style="padding: 0; text-align: center; margin: 0 0 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 18px; line-height: 1.2;">
										<a style="color: #fff; text-decoration: none; border-radius: 5px; background: #5cb85c; font-size: 14px; padding: 10px 20px;" href="${link}">Подтвердить аккаунт</a>
									</p>

									</td>
								</tr>
							</tbody>
						</table>
						</td>
					</tr>
				</tbody>
			</table>
			</td>
		</tr>
	</tbody>
</table>
</body>
</html>
        `
    })
  }
}

module.exports = new MailService()
