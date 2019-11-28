"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");
//Schema de inscricao em canais
class LikeSchema extends Schema {
  up() {
    this.create("likes", table => {
      table.increments();
      table.string("like_user_id");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("likes");
  }
}

module.exports = LikeSchema;
