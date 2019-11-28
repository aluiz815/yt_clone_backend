"use strict";
//Importacao do model de user
const User = use("App/Models/User");
//Importacao dos helpers do adonis
const Helpers = use("Helpers");

class UserController {
  //metodo de cadastro do usuario
  async store({ request, response }) {
    //pega o arquivo que o usuario quer cadastrar
    const avatar_img = request.file("avatar", {
      types: ["image"],
      size: "2mb"
    });
    //depois envia ele para o local desejado no tmpPath
    await avatar_img.move(Helpers.tmpPath("uploads/avatar"), {
      name: `${new Date().getTime()}.${avatar_img.subtype}`
    });
    //faz uma verificao para ver se deu tudo certo enquanto estava movendo o arquivo
    if (!avatar_img.moved()) {
      return avatar_img.error();
    }
    //Pega os dados do usuario
    const { name, username, email, password } = request.body;
    //cadastra o usuario no banco de dados
    const user = await User.create({
      name,
      username,
      email,
      password
    });
    //coloca o campo avatar com o nome do arquivo no upload acima
    user.avatar = avatar_img.fileName;
    //salva essa alteracao
    await user.save();
    //recupera o avatar
    const { avatar } = user;
    //cria uma variavel temporaria
    const url = await user.getAvatarUrl({ avatar });
    //retorna para o client
    return response.json({ name, avatar, username, url });
  }
  //Metodo de autenticacao do usuario
  async session({ request, auth }) {
    //pega o email e senha do usuario
    const { email, password } = request.body;
    //utiliza o metodo auth do adonis para verificar se o usuario existe e se todos os campos batem
    const token = await auth.attempt(email, password);
    //retorna o token
    return token;
  }
  //Metodo para mostrar apenas um usuario
  async show({ params, response }) {
    //Procura o usuario no bd utilizando o id enviado pelo parametro das rotas
    const user = await User.findOrFail(params.id);
    //Faz uma desestruturacao
    const { name, username, email, avatar } = user;
    //Cria uma variavel temporaria para mostrar o avatar
    const url = await user.getAvatarUrl({ avatar });
    //Pega os canais inscritos
    const subscribers = await user.likes().fetch();
    //Pega os videos
    const videos = await user.videos().fetch();
    return response.json({ name, username, email, url, subscribers, videos });
  }
  //Metodo de atualizacao
  async update({ request, auth, params, response }) {
    //Ve se o usuario existe no bd
    const user = await User.findOrFail(params.id);
    //verifica se o usuario e igual ao autenticado
    if (user.id !== auth.user.id) {
      return response.status(401).json({ msg: "User does not match" });
    }
    //Pega todos os dados
    const data = request.all();
    //Faz um merge
    user.merge(data);
    //Salva no bd
    await user.save();
    return response.json({ msg: "User updated" });
  }
  //Metodo para deletar O Usuario
  async destroy({ auth, params, response }) {
    const user = await User.findOrFail(params.id);
    if (user.id !== auth.user.id) {
      return response.status(401).json({ msg: "User does not match" });
    }
    await user.delete();
    return response.json({ msg: "User deleted" });
  }
}

module.exports = UserController;
