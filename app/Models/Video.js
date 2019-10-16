"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const Env = use("Env");
class Video extends Model {
  static get computed() {
    return ["video_url", "thumb_url"];
  }
  getVideoUrl({ name, user_id }) {
    return `${Env.get("APP_URL")}/files/videos/${user_id}/${name}`;
  }
  getThumbUrl({ thumb, user_id }) {
    return `${Env.get("APP_URL")}/files/videos/${user_id}/${thumb}`;
  }
  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Video;
