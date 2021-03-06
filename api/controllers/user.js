"use strict";
var bcrypt = require("bcrypt-nodejs");
var mongoosePaginate = require("mongoose-pagination");
var fs = require("fs");
var path = require("path");

var Follow = require("../models/follow");
var Publication = require("../models/publication");
var User = require("../models/user");
var jwt = require("../services/jwt");

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

function loginUser(req, res) {
  var params = req.body;

  var email = params.email;
  var password = params.password;

  User.findOne({ email: email }, (err, user) => {
    if (err) return res.status(500).send({ message: "error en la peticion" });

    if (user) {
      bcrypt.compare(password, user.password, (err, check) => {
        if (check) {
          if (params.gettoken) {
            //generar y devolver un token
            return res.status(200).send({
              token: jwt.createToken(user),
            });
          } else {
            //devuelve los datos  del usuario
            user.password = undefined;
            return res.status(200).send({ user });
          }
        } else {
          return res
            .status(404)
            .send({ message: "el usuario nope se ha podido logear" });
        }
      });
    } else {
      return res
        .status(404)
        .send({ message: "el usuario nop se ha podido logear!!" });
    }
  });
}

//conseguir datos de un usuario

function getUser(req, res) {
  var userId = req.params.id;

  User.findById(userId, (err, user) => {
    if (!user) return res.status(404).send({ message: "User Not Found." });
    if (err) return res.status(500).send({ message: "Request Error." });

    followThisUser(req.user.sub, userId).then((value) => {
      return res.status(200).send({
        user,
        following: value.following,
        followed: value.followed,
      });
    });
  });
}

async function followThisUser(identity_user_id, user_id) {
  var following = await Follow.findOne({
    user: identity_user_id,
    followed: user_id,
  })
    .exec()
    .then((follow) => {
      return follow;
    })
    .catch((err) => {
      return handleError(err);
    });

  var followed = await Follow.findOne({
    user: user_id,
    followed: identity_user_id,
  })
    .exec()
    .then((follow) => {
      console.log(follow);
      return follow;
    })
    .catch((err) => {
      return handleError(err);
    });

  return {
    following: following,
    followed: followed,
  };
}

//listado de usuarios paginados

function getUsers(req, res) {
  var identity_user_id = req.user.sub;
  var page = 1;
  if (req.params.page) {
    page = req.params.page;
  }
  var itemsPerPage = 5;

  User.find()
    .sort("_id")
    .paginate(page, itemsPerPage, (err, users, total) => {
      if (err) return res.status(500).send({ message: "error en la peticion" });
      if (!users)
        return res.status(404).send({ message: "no hay usuarios disponibles" });

      followUserIds(identity_user_id).then((value) => {
        return res.status(200).send({
          users,
          users_following: value.following,
          user_follow_me: value.followed,
          total,
          pages: Math.ceil(total / itemsPerPage),
        });
      });
    });
}

async function followUserIds(user_id) {
  var following = await Follow.find({ user: user_id })
    .select({ _id: 0, __uv: 0, user: 0 })
    .exec()
    .then((follows) => {
      var follows_clean = [];

      follows.forEach((follow) => {
        follows_clean.push(follow.followed);
      });

      console.log(follows_clean);

      return follows_clean;
    })
    .catch((err) => {
      return handleerror(err);
    });

  var followed = await Follow.find({ followed: user_id })
    .select({ _id: 0, __uv: 0, followed: 0 })
    .exec()
    .then((follows) => {
      var follows_clean = [];

      follows.forEach((follow) => {
        follows_clean.push(follow.user);
      });

      return follows_clean;
    })
    .catch((err) => {
      return handleerror(err);
    });

  console.log(following);

  return {
    following: following,

    followed: followed,
  };
}

function getCounters(req, res) {
  var userId = req.user.sub;

  if (req.params.id) {
    userId = req.params.id;
  }
  getCountFollow(userId).then((value) => {
    return res.status(200).send(value);
  });
}

async function getCountFollow(user_id) {
  var following = await Follow.countDocuments({ user: user_id })
    .exec()
    .then((count) => {
      console.log(count);
      return count;
    })
    .catch((err) => {
      return handleError(err);
    });

  var followed = await Follow.countDocuments({ followed: user_id })
    .exec()
    .then((count) => {
      return count;
    })
    .catch((err) => {
      return handleError(err);
    });
  var publications = await Publication.count({ user: user_id })
    .exec()
    .then((count) => {
      return count;
    })
    .catch((err) => {
      if (err) return handleError(err);
    });

  return {
    following: following,
    followed: followed,
    publications: publications,
  };
}

// editar los datos de un usuario

function updateUser(req, res) {
  var userId = req.params.id;
  var update = req.body;
  //borrar la propiedad password

  delete update.password;
  if (userId != req.user.sub) {
    return res.status(500).send({
      message: "no tienes persmiso para actualizar los datos del usuario",
    });
  }

  User.findByIdAndUpdate(userId, update, { new: true }, (err, userUpdated) => {
    if (err) return res.status(500).send({ message: "error en la peticion" });
    if (!userUpdated)
      return res
        .status(404)
        .send({ message: "no se ha podido actuializar el usuario" });

    return res.status(200).send({ user: userUpdated });
  });
}

// Subir archivos de imagen/avatar de usuario
// Subir archivos de imagen/avatar de usuario
function uploadImage(req, res) {
  var userId = req.params.id;

  if (req.files) {
    var file_path = req.files.image.path;

    //convertimos path en arreglo para gaurdar solo el nombre
    var file_split = file_path.split("\\");
    var file_name = file_split[2];

    var ext_split = file_name.split(".");
    var file_ext = ext_split[1]; // Obtenemos la extension del arreglo.

    if (userId != req.user.sub) {
      return removeFilesOfUploads(
        res,
        file_path,
        "no tienes permiso para actualizar los datos ."
      );
    }

    if (
      file_ext == "png" ||
      file_ext == "jpg" ||
      file_ext == "jpeg" ||
      file_ext == "gif"
    ) {
      //actualizar documento de usuario logeado.
      User.findByIdAndUpdate(
        userId,
        { image: file_name },
        { new: true },
        (err, userUpdate) => {
          if (err)
            return res
              .status(500)
              .send({ message: "Error en la peticio updateUser()" });
          if (!userUpdate)
            return res
              .status(404)
              .send({ message: "No se ha podido actualizar el usuario." });

          return res.status(200).send({ user: userUpdate });
        }
      );
    } else {
      return removeFilesOfUploads(res, file_path, "Extension no valida.");
    }
  }
}
function removeFilesOfUploads(res, file_path, message) {
  fs.unlink(file_path, (err) => {
    return res.status(200).send({ message: message });
  });
}
function removeFilesOfUploads(res, file_path, message) {
  fs.unlink(file_path, (err) => {
    return res.status(200).send({ message: message });
  });
}

function getImageFile(req, res) {
  var image_file = req.params.imageFile;
  var path_file = "./uploads/users/" + image_file;

  fs.exists(path_file, (exists) => {
    if (exists) {
      res.sendFile(path.resolve(path_file));
    } else {
      res.status(200).send({ message: "No existe la imagen..." });
    }
  });
}

module.exports = {
  home,
  pruebas,
  saveUser,
  loginUser,
  getUser,
  getUsers,
  getCounters,
  updateUser,
  uploadImage,
  getImageFile,
};
