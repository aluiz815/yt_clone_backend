"use strict";
const Helpers = use("Helpers");
const Video = use("App/Models/Video");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with videos
 */
class VideoController {
  /**
   * Show a list of all videos.
   * GET videos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response }) {
    const video = await Video.query()
      .with("user", builder => {
        builder.select(["id", "name", "avatar"]);
      })
      .fetch();
    return response.json({ video });
  }

  /**
   * Create/save a new video.
   * POST videos
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const video = request.file("video", {
      types: ["video"],
      size: "100mb"
    });
    await video.move(Helpers.tmpPath("uploads/videos"), {
      name: `${new Date().getTime()}.${video.subtype}`
    });
    if (!video.moved()) {
      return video.error();
    }
    const { title, description } = request.body;
    const videos = await Video.create({
      title,
      description,
      user_id: auth.user.id
    });
    videos.name = video.fileName;
    await videos.save();
    return response.json(videos);
  }

  /**
   * Display a single video.
   * GET videos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, response }) {
    const video = await Video.findOrFail(params.id);
    await video.load("user", builder => {
      builder.select(["name", "avatar"]);
    });
    return response.json({ video });
  }

  /**
   * Update video details.
   * PUT or PATCH videos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ request, params, response,auth }) {
    const video = await Video.findOrFail(params.id);
    if (!video) {
      return response.status(401).json({ msg: "Video does not exists" });
    }
    if(video.user_id !== auth.user.id){
      return response.status(401).json({ msg: "User does not match" });
    }
    const data = request.all();
    video.merge(data);
    await video.save();
    return response.json({ msg: "Video updated" });
  }

  /**
   * Delete a video with id.
   * DELETE videos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response,auth }) {
    const video = await Video.findOrFail(params.id);
    if(video.user_id !== auth.user.id){
      return response.status(401).json({ msg: "User does not match" });
    }
    await video.delete();
    return response.json({ msg: "Video deleted" });
  }
}

module.exports = VideoController;
