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

    // Controlar usuarios duplicados

    User.find({
      $or: [
        { email: user.email.toLowerCase() },
        { nick: user.nick.toLowerCase() },
      ],
    }).exec((err, users) => {
      if (err)
        return res
          .status(500)
          .send({ message: "Error en la peticion del usuario" });
      if (users && users.length >= 1) {
        return res.status(200).send({ message: "el usuario ya existe :c" });
      } else {
        // Cifra la password y me guarda los datos
        bcrypt.hash(params.password, null, null, (err, hash) => {
          user.password = hash;

          user.save((err, userStored) => {
            if (err)
              return res
                .status(500)
                .send({ message: "Error al guardar el usuario" });

            if (userStored) {
              res.status(200).send({ user: userStored });
            } else {
              res
                .status(404)
                .send({ message: "No se ha registrado el usuario" });
            }
          });
        });
      }
    });
  } else {
    res.status(200).send({
      message: "Envia todos los campos necesarios owo",
    });
  }
}

module.exports = {
  home,
  pruebas,
  saveUser,
};
