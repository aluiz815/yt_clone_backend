"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
//Todas as rotas da aplicacao
const Route = use("Route");
//Rotas para mostrar os uploads de imagem e video
Route.get("/files/avatar/:file", "FileController.avatar");
Route.get("/files/videos/:id/:file", "FileController.video");
//Rota de busca de video
Route.get("/search", "SearchController.index");
//Rotas de Usuario
Route.group(() => {
  Route.post("new", "UserController.store");
  Route.post("login", "UserController.session");
  Route.get("getuser/:id", "UserController.show");
  Route.put("getuser/:id", "UserController.update").middleware(["auth"]);
  Route.delete("getuser/:id", "UserController.destroy").middleware(["auth"]);
}).prefix("users");

//Rotas de Videos
Route.group(() => {
  Route.get("/", "VideoController.index");
  Route.post("new", "VideoController.store").middleware(["auth"]);
  Route.get("getvideo/:id", "VideoController.show");
  Route.put("getvideo/:id", "VideoController.update").middleware(["auth"]);
  Route.delete("getvideo/:id", "VideoController.destroy").middleware(["auth"]);
}).prefix("videos");
//Rota de inscricao em canais
Route.post(":userVideoId/like", "LikeController.store")
  .prefix("users")
  .middleware(["auth"]);

  //middleware de auth para so conseguir acessar a rota quem estiver autenticado
