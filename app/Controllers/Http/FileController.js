"use strict";
//Importacao dos helpers do proprio adonis para o acesso a rota de uploads localmente
const Helpers = use("Helpers");

class FileController {
  //metodo para acessar o avatar do usuario
  async avatar({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/avatar/${params.file}`));
  }
  //metodo para acessar o video do usuario
  async video({ params, response }) {
    return response.download(
      Helpers.tmpPath(`uploads/videos/${params.id}/${params.file}`)
    );
  }
}

module.exports = FileController;
