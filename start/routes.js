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
const Route = use("Route");
Route.get("/files/avatar/:file", "FileController.avatar");
Route.get("/files/videos/:id/:file", "FileController.video");
Route.get("/search", "SearchController.index");
Route.group(() => {
  Route.post("new", "UserController.store");
  Route.post("login", "UserController.session");
  Route.get("getuser/:id", "UserController.show");
  Route.put("getuser/:id", "UserController.update").middleware(["auth"]);
  Route.delete("getuser/:id", "UserController.destroy").middleware(["auth"]);
}).prefix("users");
Route.group(() => {
  Route.get("/", "VideoController.index");
  Route.post("new", "VideoController.store").middleware(["auth"]);
  Route.get("getvideo/:id", "VideoController.show");
  Route.put("getvideo/:id", "VideoController.update").middleware(["auth"]);
  Route.delete("getvideo/:id", "VideoController.destroy").middleware(["auth"]);
}).prefix("videos");
Route.post(":userVideoId/like", "LikeController.store")
  .prefix("users")
  .middleware(["auth"]);
