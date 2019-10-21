"use strict";
const Database = use("Database");
class SearchController {
  async index({ request, response }) {
    const { video, page } = request.get();
    const videos = await Database.from("videos")
      .where("title", "=", video)
      .paginate(page, 10);
    return response.json({ videos });
  }
}

module.exports = SearchController;
