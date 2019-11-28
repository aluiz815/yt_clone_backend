"use strict";
//Utiliza os helpers do adonis
const Helpers = use("Helpers");
//Importa o model de Video
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
  //Metodo para listar video
  async index({ request, response }) {
    //paginacao
    const { page } = request.get();
    //busca um video no bd utilizando vericacao para trazer apenas alguns dados
    const video = await Video.query()
      .with("user", builder => {
        builder.select(["id", "name", "avatar"]);
      })
      .paginate(page, 10);
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
  //Metodo para cadastrar um video, igual do usuario porem muda os dados
  async store({ request, response, auth }) {
    const user = await auth.getUser();
    const { id } = user;
    const video = request.file("video", {
      types: ["video"],
      size: "100mb"
    });
    await video.move(Helpers.tmpPath(`uploads/videos/${id}`), {
      name: `${new Date().getTime()}.${video.subtype}`
    });
    if (!video.moved()) {
      return video.error();
    }
    const thumb = request.file("thumb", {
      types: ["image"],
      size: "2mb"
    });
    await thumb.move(Helpers.tmpPath(`uploads/videos/${id}`), {
      name: `${new Date().getTime()}.${thumb.subtype}`
    });
    if (!thumb.moved()) {
      return thumb.error();
    }
    const { title, description } = request.body;
    const videos = await Video.create({
      title,
      description,
      user_id: auth.user.id,
      name: video.fileName,
      thumb: thumb.fileName
    });
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
  //Metodo para mostrar um video
  async show({ params, response }) {
    //procura um video pelo id
    const video = await Video.findOrFail(params.id);
    //vai no user e recupera o nome da pessoa que cadastrou o video
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
  //Metodo para atualizar um video
  async update({ request, params, response, auth }) {
    const user = await auth.getUser();
    const { id } = user;
    const video = await Video.findOrFail(params.id);
    if (!video) {
      return response.status(401).json({ msg: "Video does not exists" });
    }
    if (video.user_id !== auth.user.id) {
      return response.status(401).json({ msg: "User does not match" });
    }
    const thumb = request.file("thumb", {
      types: ["image"],
      size: "2mb"
    });
    await thumb.move(Helpers.tmpPath(`uploads/videos/${id}`), {
      name: `${new Date().getTime()}.${thumb.subtype}`
    });
    if (!thumb.moved()) {
      return thumb.error();
    }

    const { title, description } = request.body;
    video.merge({ title, description, thumb: thumb.fileName });
    await video.save();
    return response.json(video);
  }

  /**
   * Delete a video with id.
   * DELETE videos/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  //Metodo para deletar o video
  async destroy({ params, response, auth }) {
    const video = await Video.findOrFail(params.id);
    if (video.user_id !== auth.user.id) {
      return response.status(401).json({ msg: "User does not match" });
    }
    await video.delete();
    return response.json({ msg: "Video deleted" });
  }
}

module.exports = VideoController;
