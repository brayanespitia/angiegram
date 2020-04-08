"use strict";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = Schema({
  text: String,
  created_at: String,
  emitter: { type: Schema.ObjetId, ref: "user" },
  receiver: { type: Schema.ObjetId, ref: "user" },
});

module.exports = mongoose.model("Message", MessageSchema);
