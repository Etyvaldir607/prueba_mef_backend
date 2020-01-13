'use strict';

const domain = require('../domain');
const Params = require('app-params');
const Logs = require('app-logs');
const { config } = require('../common');
const Graphql = require('./graphql');
const { mergeGraphql } = require('./lib/util');

module.exports = async function setupModule (settings = { iop: true }) {
  try {
    global.IOP = !!settings.iop;

    // Cargando Capa del dominio
    let services = await domain(settings);

    // Agregando parámetros a los servicios
    services.Parametro = await Params(config.db);

    // Agregando Logs a los servicios
    services.Log = await Logs(config.db);

    // Cargando GRAPHQL
    let graphql = Graphql(services);

    // Uniendo Graphql de usuarios con Graphql de parámetros
    mergeGraphql(graphql, services.Parametro.graphql, ['DateP']);

    // Uniendo Graphql de usuarios con Graphql de Logs
    mergeGraphql(graphql, services.Log.graphql, ['DateL']);

    if (global.IOP) {
      // Agregando Iop a los servicios
      const Iop = require('app-iop');
      services.Iop = await Iop(config.db);

      // Uniendo Graphql de usuarios con Graphql de Iop
      mergeGraphql(graphql, services.Iop.graphql, ['DateI']);
    }

    return {
      services,
      graphql,
      _models: services._models,
      _repositories: services._repositories
    };
  } catch (err) {
    console.error(err);
    throw new Error(`Error al instanciar el módulo principal: ${err.message}`);
  }
};
