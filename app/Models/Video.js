"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
//importacao do env para poder pegar a url para criacao da variavel virtual
const Env = use("Env");
class Video extends Model {
  //criacao de duas variaveis virtuais
  static get computed() {
    return ["video_url", "thumb_url"];
  }
  //metodo que retorna a url do video
  getVideoUrl({ name, user_id }) {
    return `${Env.get("APP_URL")}/files/videos/${user_id}/${name}`;
  }
  //metodo que retorna a thumb do video
  getThumbUrl({ thumb, user_id }) {
    return `${Env.get("APP_URL")}/files/videos/${user_id}/${thumb}`;
  }
  //relacionamento com usuario
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Video;
