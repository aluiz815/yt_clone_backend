"use strict";
const Like = use("App/Models/Like");
const User = use("App/Models/User");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with likes
 */
class LikeController {
  /**
   * Create/save a new like.
   * POST likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, auth }) {
    const { userVideoId } = request.params;
    const userLogged = await auth.getUser();
    const videoUser = await User.findOrFail(userVideoId);
    const userLoggedString = userLogged.id.toString();
    const subscribers = await userLogged.likes().fetch();
    const arraySubs = [subscribers];
    const resultArray = arraySubs.find(obj => obj.like_user_id !== userVideoId);
    if (!userLogged) {
      return response.status(401).json({ msg: "User not logged" });
    }
    if (userLoggedString === userVideoId) {
      return response.status(400).json({ msg: "You are the user" });
    }
    if (!videoUser) {
      return response.status(400).json({ msg: "User does not exists" });
    }
    if (resultArray) {
      return response.status(400).json({ msg: "You are already subscribed" });
    }
    const like = await Like.create({
      like_user_id: userVideoId,
      user_id: userLoggedString
    });

    return response.json({ like });
  }
}

module.exports = LikeController;
