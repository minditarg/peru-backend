const usuario = require('../db/models').Usuario;
const Proveedor = require('../db/models').Proveedor;
const Cliente = require('../db/models').Cliente;
const Servicio = require('../db/models').Servicio;
const Localidad = require('../db/models').Localidad;
const PasswordRecovery = require('../db/models').PasswordRecovery;
const ResponseFormat = require('../core').ResponseFormat;
const nodemailer = require('nodemailer');
module.exports = {
    get(req, res) {
        return usuario.findByPk(req.user.dataValues.id, {
            include: [
                {
                    model: Proveedor,
                    include: [{ model: Servicio, as: "servicios" }, { model: Localidad, as: "localidad" }]

                },
                {
                    model: Cliente
                }
            ]
        })
            .then(usuario => res.status(201).json(ResponseFormat.build(
                usuario,
                "Detalle del Usuario",
                201,
                "success"
            )))
            .catch(error => res.status(400).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error al devolver el Usuario:" + error,
                "error"
            )))
    },


    recuperarPassword(req, res) {
        usuario.findOne( { where: {  email: req.params.email, provider: 'Local' } })
            .then(user => {
                if (!user) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No existe el usuario",
                            404,
                            "error"
                        )
                    )
                }
                let token = Math.random().toString(36).substring(7);
                return PasswordRecovery
                    .create({
                        email: req.body.email,
                        usado: false,
                        token: token,
                        expires: new Date(Date.now() + 3000), //15min
                    })
                    .then(cliente => {
                        var transporter = nodemailer.createTransport({
                            service: process.env.EMAIL_PROVIDER,
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASSWORD
                            }
                        });

                        var mailOptions = {
                            from: process.env.EMAIL_USER,
                            to: req.body.email,
                            subject: 'Recuperar contraseña',
                            text: 'Este es el código de recuperación que debe utilizar: ' + token
                        };
                        transporter.sendMail(mailOptions, function (error, info) {
                            if (error) {
                                return res.status(400).json(ResponseFormat.error(
                                    error,
                                    "Ocurrió un error cuando se enviaba el email",
                                    "error"
                                ));

                            } else {
                                return res.status(201).json(ResponseFormat.build(
                                    cliente,
                                    "Código enviado correctamente al email: " + req.email,
                                    201,
                                    "success"
                                ));
                            }
                        })
                    })
                    .catch(error => {
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error al recuperar la contraseña",
                            "error"
                        ));
                    })
            });
    },
    // cambiarPassword(req, res) {
    //     return Cliente
    //         .create({
    //             usuarioId: req.body.usuarioId,
    //             telefono: req.body.telefono,
    //             direccion: req.body.direccion,
    //         })
    //         .then(cliente => res.status(201).json(ResponseFormat.build(
    //             cliente,
    //             "Cliente creado correctamente",
    //             201,
    //             "success"
    //         )))
    //         .catch(error => {
    //             return res.status(400).json(ResponseFormat.error(
    //                 error.errors.map(err => err.message).join(", "),
    //                 "Ocurrió un error cuando se creaba el Cliente",
    //                 "error"
    //             ));
    //         })
    // },

}