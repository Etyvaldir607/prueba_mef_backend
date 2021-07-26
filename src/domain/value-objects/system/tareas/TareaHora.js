
'use strict';

const Datetime = require('../../general/Datetime');

class TareaHora extends Datetime {
  constructor (value, errors) {
    super('hora', value, {}, errors);
  }
}

module.exports = TareaHora;
