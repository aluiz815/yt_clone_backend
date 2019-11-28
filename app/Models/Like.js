"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
//Importacao dos models do adonis
const Model = use("Model");

class Like extends Model {
  //Relacionamento de inscricao com usuario
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Like;
