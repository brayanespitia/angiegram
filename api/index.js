"use strict";

var mongoose = require("mongoose");
var app = require("./app");
var port = 3800;

mongoose.set("useFindAndModify", false);
mongoose.Promise = global.Promise;
//coneccion a la base de datos
mongoose
  .connect("mongodb://localhost:27017/angiegram", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("la conexion a la base de datos angiegram se realizo con exit");

    //crear servidor
    app.listen(port, () => {
      console.log("servidor corriendo conrrectamente en http://localhost:3800");
    });
  })
  .catch((err) => console.log(err));
