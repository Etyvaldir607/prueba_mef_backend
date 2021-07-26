'use strict';

const Text = require('../../general/Text');

class TareaDescripcion extends Text {
  constructor (value, errors) {
    super('descripcion', value, {}, errors);
  }
}

module.exports = TareaDescripcion;
