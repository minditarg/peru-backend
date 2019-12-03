const categoria = require('../db/models').Categoria;
const servicio = require('../db/models').Servicio;

const Servicio = require('../db/models').Servicio;
const Subcategoria = require('../db/models').Subcategoria;
const Cliente = require('../db/models').Cliente;

const Trabajo = require('../db/models').Trabajo;
const ResponseFormat = require('../core').ResponseFormat;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
module.exports = {
    get(req, res) {
        return Trabajo.findByPk(req.params.id,{
            include: [
                {
                    model: Cliente,
                    as: "cliente",
                    include:[{model: Cliente, as: "Cliente" }]
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
            error.message,
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
                    error.message,
                    "Ocurrió un error cuando se creaba el Trabajo " + error.message,
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
                    error.message,
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
                            error.message,
                            "Ocurrió un error cuando se eliminaba el Trabajo: " + error.message,
                            500,
                            "error"
                        )
                    ));
            });
    }
    
}