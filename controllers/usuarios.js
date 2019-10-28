const Usuario = require('../db/models').Usuario;
const ResponseFormat = require('../core').ResponseFormat;
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const error_types = require('./error_types');

module.exports = {

    register: (req, res, next) => {
        Usuario.find({where: {email: req.body.email }})
            .then(data => { //si la consulta se ejecuta
                if (data) { //si el usuario existe
                    throw new error_types.InfoError("user already exists");
                }
                else { //si no existe el usuario se crea/registra
                    var hash = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_ROUNDS));
                    return Usuario
                        .create({
                            password: hash,
                            email: req.body.email
                        })
                }
            })
            .then(data => { //usuario registrado con exito, pasamos al siguiente manejador
                res.json({ data: data });
            })
            .catch(err => { //error en registro, lo pasamos al manejador de errores
                next(err);
            })
    },
    login: (req, res, next) => {
        passport.authenticate("local", { session: false }, (error, user) => {
            if (error || !user) {
                next(new error_types.Error404("username or password not correct."))
            } else {
                const payload = {
                    sub: user.id,
                    exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
                    username: user.email
                };
                const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                res.json({ data: { token: token } });
            }

        })(req, res);
    }







    // create(req, res) {
    //     return Usuario
    //     .create({
    //         password: req.body.password,
    //         email: req.body.email
    //     })
    //     .then(Usuario => res.status(201).json(ResponseFormat.build(
    //         Usuario,
    //         "Usuario creado correctamente",
    //         201,
    //         "success"
    //     )))
    //     .catch(error => res.status(400).json(ResponseFormat.error(
    //         error.message,
    //         "Something went wrong when create Usuarios",
    //         "error"
    //     )))
    // },
    // list(req, res) {
    //     return Usuario
    //     .all()
    //     .then(Usuarios => res.status(200).json(ResponseFormat.build(
    //         Usuarios,
    //         "Usuario Information Reterive successfully",
    //         200,
    //         "success"
    //     )))
    //     .catch(error => res.status(400).send(ResponseFormat.build(
    //         error.message,
    //         "Somthing went wrong when Reterieve Information",
    //         400,
    //         "error"
    //     )));
    // },

    // update(req, res) {
    //     return Usuario
    //     .findById(req.params.UsuarioId)
    //     .then(usr => {
    //         if(!usr) {
    //             return res.status(404).json(
    //                 ResponseFormat.error(
    //                     {},
    //                     "Usuario not found",
    //                     404,
    //                     "error"
    //                 )
    //             );
    //         }

    //         return usr
    //         .update({
    //             firstName: req.body.firstName || usr.firstName,
    //             lastName: req.body.lastName || usr.lastName,
    //             email:  req.body.email || usr.email
    //         })
    //         .then(() => res.status(200).json(
    //             ResponseFormat.build(
    //                 usr,
    //                 "Usuario Update successfully",
    //                 200,
    //                 "success"
    //             )
    //         ))
    //         .catch((error) => res.status(500).json(
    //             ResponseFormat.build(
    //                 {},
    //                 "someting went wrong when update the Usuario",
    //                 500,
    //                 "error"
    //             )
    //         ));
    //     });
    // }

}