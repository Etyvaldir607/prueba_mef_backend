'use strict';

const debug = require('debug')('app:service:token');
const ClienteNotificaciones = require('app-notificaciones');
const Service = require('../Service');

module.exports = function tokenService (repositories, valueObjects, res) {
  const { TokenRepository, UsuarioRepository, EntidadRepository, Iop } = repositories;
  const {
    TokenToken,
    TokenTipo,
    TokenEstado
  } = valueObjects;

  async function findAll (params = {}) {
    debug('Lista de tokens|filtros');

    return Service.findAll(params, TokenRepository, res, 'Tokens');
  }

  async function findById (id) {
    debug('Buscando token por ID');

    return Service.findById(id, TokenRepository, res, 'Token');
  }

  async function createOrUpdate (data, idUsuario, generateTokenInfinite) {
    debug('Crear o actualizar token', data);

    let datos = null;
    let result;
    try {
      if (data.tipo === 'USUARIO') {
        datos = await UsuarioRepository.findByUsername(data.usuario);
      }
      if (data.tipo === 'ENTIDAD') {
        datos = await EntidadRepository.findById(data.id_entidad);
      }

      if (datos) {
        data.id_usuario = data.tipo === 'USUARIO' ? datos.id : null;
      } else {
        return res.warning(new Error('ID no valido'));
      }

      data.token = await generateTokenInfinite(data);
      data._user_created = idUsuario;
      data.estado = 'ACTIVO';

      validate(data);

      result = await TokenRepository.createOrUpdate(data);

      if (result && datos.email) {
        let pne = await Iop.findByCode('PNE-01');
        let cli = new ClienteNotificaciones(pne.token, pne.url);

        const parametros = {
          para: [datos.email],
          asunto: 'Token de acceso - APP',
          contenido: `<br> Token de acceso tipo ${data.tipo}:<br><br><small>Revise el archivo adjunto.</small>`,
          adjuntoBase64: `data:text/plain;base64,${Buffer.from(data.token).toString('base64')}`
        };

        let correo = await cli.correo(parametros);
        debug('Respuesta envio correo', correo);
        if (correo && !correo.finalizado) {
          return res.warning(new Error('No se pudo enviar el correo'));
        }
      }
    } catch (e) {
      return res.error(e);
    }

    return res.success(result);
  }

  async function deleteItem (id) {
    debug('Eliminando token');

    return Service.deleteItem(id, TokenRepository, res, 'Token');
  }

  function validate (data) {
    Service.validate(data, {
      token: TokenToken,
      tipo: TokenTipo,
      estado: TokenEstado
    });
  }

  return {
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
