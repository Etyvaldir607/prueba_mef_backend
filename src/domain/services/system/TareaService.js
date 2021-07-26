'use strict';

const debug = require('debug')('app:service:tarea');
const Service = require('../Service');

module.exports = function tareaService (repositories, valueObjects, res) {
  const { TareaRepository } = repositories;
  const {
    TareaNombre,
    TareaEstado,
    TareaFecha,
    TareaHora,
    TareaDescripcion
  } = valueObjects;

  async function findAll (params = {}, rol, idTarea) {
    debug('Lista de tarea|filtros');

    switch (rol) {
      case 'ADMIN':
        params.id_tarea = idTarea;
        break;
      case 'USUARIO':
        params.id_tarea = idTarea;
        break;
    }

    return Service.findAll(params, TareaRepository, res, 'Tarea');
  }

  async function findById (id) {
    debug('Buscando entidad por ID', id);

    return Service.findById(id, TareaRepository, res, 'Tarea');
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar tarea');

    validate(data);

    return Service.createOrUpdate(data, TareaRepository, res, 'Tarea');
  }

  async function deleteItem (id) {
    debug('Eliminando tarea');

    return Service.deleteItem(id, TareaRepository, res, 'Tarea');
  }

  function validate (data) {
    Service.validate(data, {
      nombre: TareaNombre,
      fecha: TareaFecha,
      hora: TareaHora,
      descripcion: TareaDescripcion,
      estado: TareaEstado
    });
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
