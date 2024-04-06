const nodemailer = require('nodemailer');
const ErrorHandler = require('./errorHandler');

exports.sendmail = (req, res, next, url) => {
  const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.MAIL_EMAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Non sense <jhethalal645@gmail.com>",
    to: req.body.email,
    subject: "Password Reset Link",
    html: `<h1>Click link below to reset the password</h1>
                <a href="${url}">Password reset link</a> `,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      return next(new ErrorHandler(err, 500));
    }

    console.log(info);

    res.status(200).json({
      message: "Mail sent successfully",
      url,
    });
  });
};
