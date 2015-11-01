/* global require, module */

var Observer = require('./Observer'),
  // more information about the API at
  // http://www.nodemailer.com/docs/usage-example
  mail = require('nodemailer'),
  transporter = mail.createTransport();

function MailObserver(config) {
  'use strict';
  this.config = config;
}

MailObserver.prototype = Object.create(Observer.prototype);

MailObserver.prototype.update = function (title, data) {
  'use strict';
  transporter.sendMail({
    from: this.config.from,
    to: this.config.to,
    subject: title,
    text: data
  });
  console.log("Email sent");
};

module.exports = MailObserver;

