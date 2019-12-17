const categoria = require('../db/models').Categoria;
const servicio = require('../db/models').Servicio;

const Servicio = require('../db/models').Servicio;
const Subcategoria = require('../db/models').Subcategoria;
const Cliente = require('../db/models').Cliente;
const Proveedor = require('../db/models').Proveedor;
const Usuario = require('../db/models').Usuario;
const Trabajo = require('../db/models').Trabajo;
const ResponseFormat = require('../core').ResponseFormat;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
module.exports = {
    get(req, res) {
        return Trabajo.findByPk(req.params.id, {
            include: [
                {
                    model: Cliente,
                    as: "cliente",
                    include: [{ model: Cliente, as: "Cliente", include: [{ model: models.Usuario }] }]
                },
                {
                    model: Servicio,
                    as: "servicio",
                }
            ]
        })
            .then(Trabajo => res.status(201).json(ResponseFormat.build(
                Trabajo,
                "Detalle del trabajo",
                201,
                "success"
            )))
            .catch(error => res.status(400).json(ResponseFormat.error(
                error.errors.map(err => err.message).join(", "),
                "Ocurrió un error al devolver el trabajo",
                "error"
            )))
    },
    create(req, res) {
        return Trabajo
            .create({
                clienteId: req.body.clienteId,
                servicioId: req.body.servicioId,
                puntajeDelProveedor: req.body.puntajeDelProveedor,
                descripcionDelProveedor: req.body.descripcionDelProveedor,
            })
            .then(Trabajo => res.status(201).json(ResponseFormat.build(
                Trabajo,
                "Trabajo creado correctamente",
                201,
                "success"
            )))
            .catch(error => {
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se creaba el Trabajo",
                    "error"
                ));
            })
    },
    puntuarTrabajo(req, res) {
        return Trabajo
            .findByPk(req.body.trabajoId)
            .then(trabajo => {
                if (!trabajo) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            {},
                            "No se encuentra el trabajo",
                            404,
                            "error"
                        )
                    );
                }
                return trabajo
                    .update({
                        puntajeDelCliente: req.body.puntajeDelCliente,
                        descripcionDelCliente: req.body.descripcionDelCliente,

                    })
                    .then(trabajo => res.status(201).json(ResponseFormat.build(
                        trabajo,
                        "Trabajo actualizado correctamente",
                        201,
                        "success"
                    )))
                    .catch(error => {
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba el Trabajo",
                            "error"
                        ));
                    })
            })
            .catch(error => {
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se actualizaba el Trabajo",
                    "error"
                ));
            })
    },

    list(req, res) {
        return Trabajo
            .findAll({
                include: [
                    {
                        model: Cliente,
                        include: [{ model: Usuario }]
                    },
                    {
                        model: Servicio,
                    }
                ]
            })
            .then(Trabajo => {
                if (!Trabajo) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron Trabajos",
                            404,
                            "error"
                        )
                    )
                }

                return res.status(200).json(
                    ResponseFormat.build(
                        Trabajo,
                        "Listado de Trabajos",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrio un error al devolver el listado de Trabajos",
                    500,
                    "error"
                )
            ));
    },
    destroy(req, res) {
        return Trabajo
            .findById(req.params.id)
            .then(Trabajo => {
                if (!Trabajo) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            "No se encuentra el Trabajo",
                            "Ocurrió un error cuando se eliminaba el Trabajo",
                            404,
                            "error"
                        )
                    );
                }

                return Trabajo
                    .destroy()
                    .then(() => res.status(200).json(
                        ResponseFormat.build(
                            {},
                            "Trabajo eliminado correctamente",
                            200,
                            "success"
                        )
                    ))
                    .catch(error => res.status(500).json(
                        ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se eliminaba el Trabajo",
                            500,
                            "error"
                        )
                    ));
            });
    },
    listadoPorClienteSinCalificar(req, res) {
        return Trabajo
            .findAll({
                where: {
                    clienteId: req.params.id,
                    puntajeDelCliente: null
                },
                include: [
                    {
                        model: Cliente,
                        include: [{ model: Usuario }]
                    },
                    {
                        model: Servicio,
                        include: [{ model: Proveedor, include: [{ model: Usuario }] }]
                    },

                ]
            })
            .then(Trabajo => {
                if (!Trabajo) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron Trabajos",
                            404,
                            "error"
                        )
                    )
                }

                return res.status(200).json(
                    ResponseFormat.build(
                        Trabajo,
                        "Listado de Trabajos",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                console.log(error);
                return res.status(500).json(
                    ResponseFormat.error(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrio un error al devolver el listado de Trabajos",
                        500,
                        "error"
                    )

                )
            });
    },
    listadoPorClienteCalificados(req, res) {
        return Trabajo
            .findAll({
                where: {
                    clienteId: req.params.id,
                    puntajeDelCliente: {
                        [Op.ne]: null
                    }
                },
                include: [
                    {
                        model: Cliente,
                        include: [{ model: Usuario }]
                    },
                    {
                        model: Servicio,
                        include: [{ model: Proveedor, include: [{ model: Usuario }] }]
                    },
                ]
            })
            .then(Trabajo => {
                if (!Trabajo) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron Trabajos",
                            404,
                            "error"
                        )
                    )
                }

                return res.status(200).json(
                    ResponseFormat.build(
                        Trabajo,
                        "Listado de Trabajos",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrio un error al devolver el listado de Trabajos",
                    500,
                    "error"
                )
            ));
    },
}