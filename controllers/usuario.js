const usuario = require('../db/models').Usuario;
const Proveedor = require('../db/models').Proveedor;
const Cliente = require('../db/models').Cliente;
const Servicio = require('../db/models').Servicio;
const Localidad = require('../db/models').Localidad;
const PasswordRecovery = require('../db/models').PasswordRecovery;
const ResponseFormat = require('../core').ResponseFormat;
const bcrypt = require('bcrypt');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
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
        usuario.findOne({ where: { email: req.body.email, provider: 'Local' } })
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
                        expires: new Date(Date.now() + 900000),
                    })
                    .then(cliente => {
                        var transporter = nodemailer.createTransport({
                            host: "smtp.mailtrap.io",
                            port: 2525,
                            auth: {
                                user: "940e01a1fe4158",
                                pass: "231ae32efba31c"
                            }
                        });

                        var mailOptions = {
                            from: "noreply@construccionesysoluciones.com",
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
                        return res.status(201).json(ResponseFormat.build(
                            cliente,
                            "Código enviado correctamente al email: " + req.email,
                            201,
                            "success"
                        ));
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
    cambiarPassword(req, res) {
        PasswordRecovery.findOne({ where: { email: req.body.email, token: req.body.codigo } }) //usado: false, expires: { [Op.gte]: Date.now() }
            .then(autorizado => {
                if (!autorizado) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No coincide el código. Intente reenviar la ayuda",
                            404,
                            "error"
                        )
                    )
                } else {
                    if (req.body.password != req.body.passwordConfirm) {
                        return res.status(404).json(
                            ResponseFormat.error(
                                {},
                                "Las contraseñas no coinciden",
                                404,
                                "error"
                            )
                        );
                    }
                    if(autorizado.usado){
                        return res.status(404).json(
                            ResponseFormat.error(
                                {},
                                "El código ya fue utilizado",
                                404,
                                "error"
                            )
                        );
                    }
                    if(Date.now() >= autorizado.expires ){
                        return res.status(404).json(
                            ResponseFormat.error(
                                {},
                                "El código expiró, envíelo nuevamente",
                                404,
                                "error"
                            )
                        );
                    }
                    autorizado.update({ usado: true }).then(resp => {
                        var hash = bcrypt.hashSync(req.body.password, parseInt(process.env.BCRYPT_ROUNDS));
                        return usuario
                            .findOne({ where: { email: req.body.email } })
                            .then(usr => {
                                if (!usr) {
                                    return res.status(404).json(
                                        ResponseFormat.error(
                                            {},
                                            "No se encuentra el usuario",
                                            404,
                                            "error"
                                        )
                                    );
                                }
                                return usr
                                    .update({
                                        password: hash,
                                    })
                                    .then(usuario => res.status(201).json(ResponseFormat.build(
                                        usuario,
                                        "Usuario actualizado correctamente",
                                        201,
                                        "success"
                                    )))
                            });
                    })
                }
            })
            .catch(error => {
                console.log(error);
                return res.status(400).json(ResponseFormat.error(
                    error,
                    "Ocurrió un error al cambiar la contraseña",
                    "error"
                ));
            });
    }
}