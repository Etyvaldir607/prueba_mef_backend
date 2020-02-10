'use strict';

const debug = require('debug')('app:controller:token');
const { userData, generateTokenInfinite } = require('../../../lib/auth');

module.exports = function setupLogsController (services) {
  const { TokenService, Log } = services;

  async function listarLogs (req, res, next) {
    debug('listando logs (sistema de archivos)');

    let user = await userData(req, services);
    let data = req.body;

    try {
      let result = await Log.findAll(data);
      // res.send({
      //   count: result.data.count,
      //   datos: {
      //     logs: result.data.rows
      //   }
      // });
      res.send({
        datos: {
          coung: result.data.count,
          datos: result.data.rows
        }
      });
    } catch (e) {
      return next(e);
    }
  };
  
  return {
    listarLogs
  };
};
