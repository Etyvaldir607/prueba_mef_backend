'use strict';
const { permissions } = require('../../../lib/auth');

module.exports = function setupResolver (services, res) {
  const { TareaService } = services;

  return {
    Query: {
      tareas: async (_, args, context) => {
        permissions(context, 'tareas:read|usuarios:read');

        let items = await TareaService.findAll(args, context.rol, context.id_tarea);
        return res(items);
      },
      tarea: async (_, args, context) => {
        permissions(context, 'tareas:read');

        let item = await TareaService.findById(args.id);
        return res(item);
      }
    },
    Mutation: {
      tareaAdd: async (_, args, context) => {
        permissions(context, 'tareas:create');

        args.tarea._user_created = context.id_usuario;
        let item = await TareaService.createOrUpdate(args.tarea);
        return res(item);
      },
      tareaEdit: async (_, args, context) => {
        permissions(context, 'tareas:update');

        args.tarea._user_updated = context.id_usuario;
        args.tarea._updated_at = new Date();
        args.tarea.id = args.id;
        let item = await TareaService.createOrUpdate(args.tarea);
        return res(item);
      },
      tareaDelete: async (_, args, context) => {
        permissions(context, 'tareas:delete');

        let deleted = await TareaService.deleteItem(args.id);
        return { deleted: res(deleted) };
      }
    }
  };
};
