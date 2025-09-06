const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "213f3e43189739",
    pass: "0f7fb45fef6a38"
  }
});

module.exports = transport;