'use strict';

const db = require('./db');
const mail = require('./mail');
const auth = require('./auth');
const openid = require('./openid');

module.exports = {
  db,
  mail,
  auth,
  openid
};
