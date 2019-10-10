"use strict";
const User = use("App/Models/User");
const Video = use("App/Models/Video");
const Helpers = use("Helpers");
class UserController {
  async store({ request, response }) {
    const avatar_img = request.file("avatar", {
      types: ["image"],
      size: "2mb"
    });
    await avatar_img.move(Helpers.tmpPath("uploads/avatar"), {
      name: `${new Date().getTime()}.${avatar_img.subtype}`
    });
    if (!avatar_img.moved()) {
      return avatar_img.error();
    }
    const { name, username, email, password } = request.body;
    const user = await User.create({
      name,
      username,
      email,
      password
    });
    user.avatar = avatar_img.fileName;
    await user.save();
    const { avatar } = user;
    const url = await user.getAvatarUrl({ avatar });
    return response.json({ name, avatar, username, url });
  }
  async session({ request, auth }) {
    const { email, password } = request.body;
    const token = await auth.attempt(email, password);
    return token;
  }
  async show({ params, response }) {
    const user = await User.findOrFail(params.id);
    const { name, avatar, email } = user;
    const url = await user.getAvatarUrl({ avatar });
    return response.json({ name, url, email });
  }
  async update({ request, auth, params, response }) {
    const user = await User.findOrFail(params.id);
    if (user.id !== auth.user.id) {
      return response.status(401).json({ msg: "User does not match" });
    }
    const data = request.all();
    user.merge(data);
    await user.save();
    return response.json({ msg: "User updated" });
  }
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
