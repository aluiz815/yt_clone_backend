"use strict";
//Importacao dos models de Inscricao em video e do usuario
const Like = use("App/Models/Like");
const User = use("App/Models/User");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

//Classe De inscricao com os metodos
class LikeController {
  /**
   * Create/save a new like.
   * POST likes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  //Metodo store que cadastra o video no bd
  async store({ request, response, auth }) {
    //Pega o id do usuario do video atraves dos parametros na rota
    const { userVideoId } = request.params;
    //pega o usuario autenticado utilizando o auth do adonis
    const userLogged = await auth.getUser();
    //Busca o usuario no bd
    const videoUser = await User.findOrFail(userVideoId);
    //Converte o id do usuario logado para string
    const userLoggedString = userLogged.id.toString();
    //Busca as inscricoes do usuario logado
    const likes = await userLogged.likes().fetch();
    //Converte para json
    const newLikes = JSON.parse(JSON.stringify(likes));
    //Verificacoes antes de salver no bd
    if (userLoggedString === userVideoId) {
      return response.status(400).json({ msg: "You are the user" });
    }
    if (!userLogged) {
      return response.status(401).json({ msg: "User not logged" });
    }

    if (!videoUser) {
      return response.status(400).json({ msg: "User does not exists" });
    }
    if (newLikes.length <= 0) {
      const like = await Like.create({
        like_user_id: userVideoId,
        user_id: userLoggedString
      });
      return response.json({ like });
    }

    for (let index = 0; index < newLikes.length; index++) {
      const element = newLikes[index];
      if (element.like_user_id === userVideoId) {
        return response.status(400).json({ msg: "You are already sub" });
      }
    }
    //se passou em todas as verificacoes ele se inscreve no canal passando o id do usuario que quer se inscrever
    //e do canal da pessoa que postou o video
    const like = await Like.create({
      like_user_id: userVideoId,
      user_id: userLoggedString
    });
    return response.json({ like });
  }
}

module.exports = LikeController;
