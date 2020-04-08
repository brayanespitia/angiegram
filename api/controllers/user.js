"use strict";
var bcrypt = require("bcrypt-nodejs");
var User = require("../models/user");

function home(req, res) {
  res.status(200).send({
    message: "hola mundo",
  });
}

function pruebas(req, res) {
  console.log(res.body);
  res.status(200).send({
    message: "pruebas en el servidor de node",
  });
}

function saveUser(req, res) {
  var params = req.body;
  var user = new User();

  if (
    params.name &&
    params.surname &&
    params.nick &&
    params.email &&
    params.password
  ) {
    user.name = params.name;
    user.surname = params.surname;
    user.nick = params.nick;
    user.email = params.email;
    user.role = "ROLE_USER";
    user.image = null;
    console.log("prueba 1");

    /*bcrypt.hash(params.password, null, null, (err, hash) => {
      user.password = hash;
      user.save((err, userStored) => {
        if (err)
          return res.status(500).send({
            message: "error al guardar el usuario"});
        if (userStored) {
          res.status(200).send({user: userStored });
        } else {
          res.status(404).send({message: "no se ha registrado el usuario"});
        }
      });
    });
    */
  } else {
    res.status(200).send({
      message: "debe completar todos los campos",
    });
    console.log("prueba 2");
  }
}

module.exports = {
  home,
  pruebas,
  saveUser,
};
