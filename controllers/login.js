const Usuario = require('../db/models').Usuario;
const Proveedor = require('../db/models').Proveedor;
const Cliente = require('../db/models').Cliente;
const Servicio = require('../db/models').Servicio;
const ResponseFormat = require('../core').ResponseFormat;
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const error_types = require('../core/error_types');

module.exports = {

    register: (req, res, next) => {
        Usuario.findOne({ where: { email: req.body.email } })
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
                    //si es tipo cliente tmb debe crearse el registro de cliente
                    if(req.body.esCliente){
                        return Usuario
                        .create({
                            password: hash,
                            email: req.body.email,
                            esCliente: req.body.esCliente
                        }).then(usuario=> {
                            return Cliente.create({
                                usuarioId:  usuario.id
                            })
                        })
                    }
                    else{ 
                    return Usuario
                        .create({
                            password: hash,
                            email: req.body.email,
                            esCliente: req.body.esCliente,
                            provider: 'Local',
                        })
                    }
                }
            })
            .then(usuario => {
                return res.status(201).json(ResponseFormat.build(
                    usuario,
                    "Usuario creado correctamente",
                    201,
                    "success"
                ));
            })
            .catch(error => { 
                console.log(error);
                return res.status(404).json(
                    ResponseFormat.build(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrió un error cuando se creaba el Usuario",
                        404,
                        "error"
                    )
                )
            })
    },
    login: (req, res, next) => {  
        passport.authenticate("local", { session: false }, (error, user) => {
            if (error || !user) {
                return res.status(404).json(
                    ResponseFormat.build(
                        error ,
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
                Usuario.findOne({
                    where: { id: user.id },
                    include: [
                        {
                            model: Proveedor,
                            include:[{model: Servicio, as: "servicios" }]
                          
                        },
                        {
                            model: Cliente
                        }
                    ]
                }).then(usuario => {

                    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                    var resp = ResponseFormat.build(
                        { tokens: token, user: usuario },
                        "Login correcto",
                        201,
                        "success"
                    );
                    res.status(201).json(resp);
                });

            }

        })(req, res);
    },

    loginWeb: (req, res, next) => {  
        passport.authenticate("local", { session: false }, (error, user) => {
            if (error || !user) {
                return res.status(404).json(
                    ResponseFormat.build(
                        error ,
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
                Usuario.findOne({
                    where: { id: user.id },
                    include: [
                        {
                            model: Proveedor,
                            include:[{model: Servicio, as: "servicios" }],
                            where: {tipo: 'Premium'}
                        },
                        {
                            model: Cliente
                        }
                    ]
                }).then(usuario => {

                    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                    var resp = ResponseFormat.build(
                        { tokens: token, user: usuario },
                        "Login correcto",
                        201,
                        "success"
                    );
                    res.status(201).json(resp);
                });

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
                res.redirect(process.env.APP_URL + "?error=El usuario denegó el ingreso");
                // return res.status(404).json(
                //     ResponseFormat.build(
                //         {},
                //         error.message,
                //         404,
                //         "error"
                //     )
                // )
            } else {
                var nuevo = false;
                Usuario.findOne({ where: { providerId: user.id } }).then(usuario => {
                    if (!usuario) {
                        console.log("El usuario no existe, se creará");
                        nuevo = true;
                        Usuario.create({
                            providerId: user.id,
                            provider: user.provider,
                            nombre: user.displayName,
                            avatar: user.photos[0].value,
                            email: user.emails[0].value,
                        }).then(usuarioNuevo => {
                            const payload = {
                                sub: usuarioNuevo.id,
                                exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
                                username: usuarioNuevo.email
                            };
                            const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                            res.redirect(process.env.APP_URL + "?token=" + token + "&nuevo=" + nuevo);
                        })
                    } else{
                        const payload = {
                            sub: usuario.id,
                            exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
                            username: user.email
                        };
                        const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                        res.redirect(process.env.APP_URL + "?token=" + token + "&nuevo=" + nuevo);
                }
                    // res.status(201).json(ResponseFormat.build(
                    //     token,
                    //     "Login correcto",
                    //     201,
                    //     "success"
                    // ));
                })
                    .catch(err => {
                        res.redirect(process.env.APP_URL + "?error=" + error.message);
                        // ResponseFormat.error(
                        //     error,
                        //     "Ocurrió un error cuando se creaba el Usuario",
                        //     500,
                        //     "error"
                        // )
                    })
            }

        })(req, res, next);
    },




    loginGoogle: (req, res, next) => {
        passport.authenticate('google', { session: false, scope: ['email'] }, (error, user, info) => {
            console.log(error, user, info);
        })(req, res, next);
    },

    loginGoogleCallback: (req, res, next) => {
        passport.authenticate('google', { session: false, scope: ['email'] }, (error, user, info) => {
            if (error || !user) {
                res.redirect(process.env.APP_URL + "?error=El usuario denegó el ingreso");
            } else {
                var nuevo = false;
                Usuario.findOne({ where: { providerId: user.id } }).then(usuario => {
                    if (!usuario) {
                        console.log("El usuario no existe, se creará");
                        nuevo = true;
                        Usuario.create({
                            providerId: user.id,
                            provider: user.provider,
                            nombre: user.displayName,
                            avatar: user.photos[0].value,
                            email: user.emails[0].value,
                        })
                    } else {
                        console.log("El usuario ya existe")
                    }
                    const payload = {
                        sub: user.id,
                        exp: Date.now() + parseInt(process.env.JWT_LIFETIME),
                        username: user.email
                    };
                    const token = jwt.sign(JSON.stringify(payload), process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGORITHM });
                    res.redirect(process.env.APP_URL + "?token=" + token + "&nuevo=" + nuevo);
                })
                    .catch(err => {
                        res.redirect(process.env.APP_URL + "?error=" + error.message);
                    })
            }

        })(req, res, next);
    },
}