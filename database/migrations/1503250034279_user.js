"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");
//Schema de usuarios
class UserSchema extends Schema {
  up() {
    this.create("users", table => {
      table.increments();
      table
        .string("name", 80)
        .notNullable()
        .unique();
      table
        .string("username", 80)
        .notNullable()
        .unique();
      table.string("avatar");
      table
        .string("email", 254)
        .notNullable()
        .unique();
      table.string("password", 60).notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("users");
  }
}

module.exports = UserSchema;
