
'use strict';

const Datetime = require('../../general/Datetime');

class TareaFecha extends Datetime {
  constructor (value, errors) {
    super('fecha', value, {}, errors);
  }
}

module.exports = TareaFecha;
