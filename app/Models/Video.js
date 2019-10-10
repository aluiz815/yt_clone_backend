"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Env = use("Env");
class Video extends Model {
  static get computed() {
    return ["video_url"];
  }
  getVideoUrl({ name }) {
    return `${Env.get("APP_URL")}/files/videos/${name}`;
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Video;
