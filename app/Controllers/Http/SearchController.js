"use strict";
//Utiliza o proprio database do adonis
const Database = use("Database");
class SearchController {
  //Metodo de Busca dos videos
  async index({ request, response }) {
    //pega o video e a pagina atravez da requisicao
    const { video, page } = request.get();
    //procura dentro do banco de dados utilizando uma verificacao
    const videos = await Database.from("videos")
      .where("title", "=", video)
      .paginate(page, 10);
    return response.json({ videos });
  }
}

module.exports = SearchController;
