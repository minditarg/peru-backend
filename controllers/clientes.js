const categoria = require('../db/models').Categoria;
const servicio = require('../db/models').Servicio;

const Servicio = require('../db/models').Servicio;
const Usuario = require('../db/models').Usuario;
const Categoria = require('../db/models').Categoria;

const Cliente = require('../db/models').Cliente;
const ResponseFormat = require('../core').ResponseFormat;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
module.exports = {
    get(req, res) {
        return Cliente.findByPk(req.params.id,{
        })
        .then(Cliente => res.status(201).json(ResponseFormat.build(
            Cliente,
            "Detalle del Cliente",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error.errors.map(err => err.message).join(", "),
            "Ocurrió un error al devolver el Cliente",
            "error"
        )))
    },
    create(req, res) {
        return Cliente
            .create({
                usuarioId: req.body.usuarioId,
                telefono: req.body.telefono,
                direccion: req.body.direccion,
            })
            .then(cliente => res.status(201).json(ResponseFormat.build(
                cliente,
                "Cliente creado correctamente",
                201,
                "success"
            )))
            .catch(error => {
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se creaba el Cliente",
                    "error"
                ));
            })
    },
    update(req, res) {
        return Usuario
            .findByPk(req.params.id)
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
                let foto = usr.foto;
                if (req.file != null) {
                    try {
                        fs.unlinkSync(process.env.PATH_FILES_UPLOAD + usr.foto);
                    } catch (err) {
                        console.error(err)
                    }
                    foto = req.file.filename
                }
                return usr
                    .update({
                        nombre: req.body.nombre,
                        avatar: foto,
                    })
                    .then(usuario => res.status(201).json(ResponseFormat.build(
                        usuario,
                        "Usuario actualizado correctamente",
                        201,
                        "success"
                    )))
                    .catch(error => {
                        try {
                            fs.unlinkSync(process.env.PATH_FILES_UPLOAD + req.file.filename);
                        } catch (err) {
                            console.error(err)
                        }
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba el Usuario",
                            "error"
                        ));
                    })
            })
            .catch(error => {
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se actualizaba el Proveedor",
                    "error"
                ));
            })
    },
    list(req, res) {
        return Cliente
            .findAll({
                include: [
                    {
                        model: Usuario,
                        attributes: {
                            exclude: ['password']
                        }
                    },
                ]
            })
            .then(clientes => {
                if (!clientes) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron Clientes",
                            404,
                            "error"
                        )
                    )
                }

                return res.status(200).json(
                    ResponseFormat.build(
                        clientes,
                        "Listado de Clientes",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrio un error al devolver el listado de Clientes",
                    500,
                    "error"
                )
            ));
    },
    destroy(req, res) {
        return Cliente
            .findById(req.params.id)
            .then(Cliente => {
                if (!Cliente) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            "No se encuentra el Cliente",
                            "Ocurrió un error cuando se eliminaba el Cliente",
                            404,
                            "error"
                        )
                    );
                }

                return Cliente
                    .destroy()
                    .then(() => res.status(200).json(
                        ResponseFormat.build(
                            {},
                            "Cliente eliminado correctamente",
                            200,
                            "success"
                        )
                    ))
                    .catch(error => res.status(500).json(
                        ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se eliminaba el Cliente",
                            500,
                            "error"
                        )
                    ));
            });
    }
    
}