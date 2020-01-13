'use strict';

function enviar (data) {
  const nodemailer = require('nodemailer');
  const smtpTransport = require('nodemailer-smtp-transport');
  const { mail } = require('../config');
  const transporter = nodemailer.createTransport(smtpTransport(mail));
  const settings = {
    from: mail.origen,
    to: data.para,
    subject: data.titulo,
    text: data.mensaje,
    html: data.html,
    attachments: data.attachments
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(settings, (error, info) => {
      if (error === null) {
        resolve(info);
      } else {
        if (error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
          resolve(error);
        } else {
          reject(error);
        }
      }
    });
  });
}

module.exports = {
  enviar
};
