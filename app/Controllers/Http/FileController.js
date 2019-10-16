"use strict";
const Helpers = use("Helpers");
class FileController {
  async avatar({ params, response }) {
    return response.download(Helpers.tmpPath(`uploads/avatar/${params.file}`));
  }
  async video({ params, response }) {
    return response.download(
      Helpers.tmpPath(`uploads/videos/${params.id}/${params.file}`)
    );
  }
}

module.exports = FileController;
