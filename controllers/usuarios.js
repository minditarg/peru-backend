const Usuario = require('../db/models').Usuario;
const ResponseFormat = require('../core').ResponseFormat;
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const error_types = require('../core/error_types');

module.exports = {

    register: (req, res, next) => {
        Usuario.find({ where: { email: req.body.email } })
            .then(usuario => {
                if (usuario) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "El usuario ya existe",
                            404,
                            "error"
                        )
                    )
                }
                else {
                    var hash = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_ROUNDS));
                    return Usuario
                        .create({
                            password: hash,
                            email: req.body.email
                        })
                }
            })
            .then(usuario => {
                res.status(201).json(ResponseFormat.build(
                    usuario,
                    "Usuario creado correctamente",
                    201,
                    "success"
                ));
            })
            .catch(err => {
                ResponseFormat.error(
                    error.message,
                    "Ocurrió un error cuando se creaba el Usuario",
                    500,
                    "error"
                )
            })
    },
    login: (req, res, next) => {
        passport.authenticate("local", { session: false }, (error, user) => {
            if (error || !user) {
                return res.status(404).json(
                    ResponseFormat.build(
                        {},
                        "El usuario o la contraseña son incorrectos",
                        404,
                        "error"
                    )
                )
            } else {
                const payload = {
                    sub: user.id,
                    exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
                    username: user.email
                };
                const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                res.status(201).json(ResponseFormat.build(
                    token,
                    "Login correcto",
                    201,
                    "success"
                ));
            }

        })(req, res);
    },

    loginFacebook: (req, res, next) => {
        passport.authenticate('facebook', { session: false, scope: ['email'] }, (error, user, info) => {
           console.log(error, user, info);
        })(req, res, next);
    },

    loginFacebookCallback: (req, res, next) => {
        passport.authenticate('facebook', { session: false, scope: ['email'] }, (error, user, info) => {
            if (error || !user) {
                return res.status(404).json(
                    ResponseFormat.build(
                        {},
                        error.message,
                        404,
                        "error"
                    )
                )
            } else {
                Usuario.findOne({ where: { providerId: user.id } }).then(usuario => {
                    if (!usuario) {
                        console.log("El usuario no existe, se creará")
                        Usuario.create({
                            providerId: user.id,
                            provider: user.provider,
                            nombre: user.displayName,
                            avatar: user.photos[0].value,
                            email: user.emails[0].value,
                        })
                    }else{
                        console.log("El usuario ya existe")
                    }
                    const payload = {
                        sub: user.id,
                        exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
                        username: user.email
                    };
                    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                    res.redirect("exp://10.30.30.125:19000")

                    // res.status(201).json(ResponseFormat.build(
                    //     token,
                    //     "Login correcto",
                    //     201,
                    //     "success"
                    // ));
                })
                    .catch(err => {
                        ResponseFormat.error(
                            error,
                            "Ocurrió un error cuando se creaba el Usuario",
                            500,
                            "error"
                        )
                    })
            }

        })(req, res, next);
    },
}