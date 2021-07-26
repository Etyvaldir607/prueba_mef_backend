const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) =>{
    let fields = {
        id: util.pk,
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false,
            xlabel: lang.t('fields.nombre')
        },

        fecha: {
            type: DataTypes.DATE,
            xlabel: lang.t('fields.fecha')
        },

        hora: {
            type: DataTypes.TIME,
            xlabel: lang.t('fields.hora')
        },

        descripcion: {
            type: DataTypes.TEXT,
            allowNull: false,
            xlabel: lang.t('fields.descripcion')
        },

        estado: {
            type: DataTypes.ENUM,
            values: ['ACTIVO', 'INACTIVO'],
            //defaultValue: 'ACTIVO',
            //allowNull: false,
            xlabel: lang.t('fields.estado')
        }
    };

        // Agregando campos para el log
    fields = util.setTimestamps(fields);

    let Tareas = sequelize.define('tareas', fields, {
        timestamps: false,
        tableName: 'sys_tareas'
    });

    return Tareas;
};