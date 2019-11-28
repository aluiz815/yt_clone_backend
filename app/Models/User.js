"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {import('@adonisjs/framework/src/Hash')} */
//Importacao do hash para poder cryptografar o password do user
const Hash = use("Hash");
//Importacao do env para pegar a url do meu app utilizado no .env
const Env = use("Env");
class User extends Model {
  //criacao de um campo virtual chamado avatar_url
  static get computed() {
    return ["avatar_url"];
  }
  static boot() {
    super.boot();
    //hook de criptografia da senha
    this.addHook("beforeSave", async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
  }
  //relacionamento com tokens
  tokens() {
    return this.hasMany("App/Models/Token");
  }
  //metodo para criacao da url virtual do avatar
  getAvatarUrl({ avatar }) {
    return `${Env.get("APP_URL")}/files/avatar/${avatar}`;
  }
  //relacionamento com video
  videos() {
    return this.hasMany("App/Models/Video");
  }
  //relacionamento com inscricoes
  likes() {
    return this.hasMany("App/Models/Like");
  }
}

module.exports = User;
