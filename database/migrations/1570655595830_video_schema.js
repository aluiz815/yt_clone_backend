"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");
//Schema de upload de videos
class VideoSchema extends Schema {
  up() {
    this.create("videos", table => {
      table.increments();
      table.string("title").notNullable();
      table.string("description").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.string("name");
      table.string("thumb");
      table.timestamps();
    });
  }

  down() {
    this.drop("videos");
  }
}

module.exports = VideoSchema;
