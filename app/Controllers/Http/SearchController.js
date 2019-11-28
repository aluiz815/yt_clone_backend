"use strict";
//Utiliza o proprio database do adonis
const Database = use("Database");
class SearchController {
  //Metodo de Busca dos videos optimizado
   filtro(vet){
       let atual;
        for (let i = 1; i < vet.length; i++) {
            let j = i - 1;
            atual = vet[i];
            while (j >= 0 && atual.created_at < vet[j].created_at) {
                vet[j+1] = vet[j];
                j--;
            }
            vet[j+1] = atual;
        }
        return vet;
    }
  async index({ request, response }) {
      //pega o video e a pagina atravez da requisicao
    const { video } = request.get();
    //procura dentro do banco de dados utilizando uma verificacao
    const videos = await Database.table("videos")
    //recebe os videos ordenados
    const order = this.filtro(videos)
    //variavel aonde vai ser colocado os videos
    const res = []
    //percorre os videos para ver se existe algum no banco de dados
    for (let index = 0; index < order.length; index++) {
      const element = order[index];
       if(element.title.toLowerCase().includes(video.toLowerCase())){
        res.push(element)
       }
    }
    //se nao existir video a variavel res vai ser = 0 oque significa que nao existe videos
    if(res.length<=0){
      return response.status(400).json({error:"Dont exists videos"})
    }
    // se passou por todas as verificacoes ele mostra os videos
    return response.json(res)
  }
}

module.exports = SearchController;
