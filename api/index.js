"use strict";

var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;

mongoose
  .connect("mongodb://localhost:27017/angiegram", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("la conexion a la base de datos angiegram se realizo con exit");
  })
  .catch((err) => console.log(err));
