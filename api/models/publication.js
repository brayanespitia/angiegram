"use strict";

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var PublicationSchema = Schma({
  text: String,
  file: String,
  create_at: String,
  user: { type: Schema.ObjetId, ref: "user" },
});

module.exports = mongoose.model("Publication", PublicationSchema);
