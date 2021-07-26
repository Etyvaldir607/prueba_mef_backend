'use strict';

const { getQuery } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function tareasRepository (models, Sequelize) {
  const { tareas } = models;
  const Op = Sequelize.Op;

  function findAll (params = {}) {
    let query = getQuery(params);
    query.where = {};

    if (params.nombre) {
      query.where.nombre = {
        [Op.iLike]: `%${params.nombre}%`
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.fecha) {
        query.where.fecha = {
            [Op.iLike]: `%${params.fecha}%`
        };
    }

    if (params.hora) {
        query.where.hora = {
            [Op.iLike]: `%${params.hora}%`
        };
    }

    if (params.id_entidad) {
      query.where.id = params.id_;
    }

    return tareas.findAndCountAll(query);
  }


  return {
    findAll,
    findById: (id) => Repository.findById(id, tareas),
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, tareas, t),
    deleteItem: (id, t) => Repository.deleteItem(id, tareas, t)
  };
};