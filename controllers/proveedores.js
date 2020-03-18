const proveedor = require('../db/models').Proveedor;
const servicios = require('../db/models').Servicio;
const categorias = require('../db/models').Categoria;
const db = require('../db/models').db;
const ResponseFormat = require('../core').ResponseFormat;
const error_types = require('../core/error_types');
const fs = require('fs');
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = {
    get(req, res) {
        return proveedor.findByPk(req.params.id)
            .then(prov => {
                if (!prov) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontró al proveedor",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        prov,
                        "Listado de proveedor",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                res.status(500).json(
                    ResponseFormat.error(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrio un error al devolver el proveedor",
                        500,
                        "error"
                    )
                )
            }
            );
    },
    list(req, res) {
        return proveedor.findOne({
            include: [{
                model: servicios,
                as: 'servicios'
            }],
        })
            .then(prov => {
                if (!prov) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontró al proveedor",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        prov[0],
                        "Listado de proveedor",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                res.status(500).json(
                    ResponseFormat.error(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrio un error al devolver el proveedor",
                        500,
                        "error"
                    )
                )
            }
            );
    },
    listEliminados(req, res) {
        return proveedor.findAll({
            include: [{
                model: servicios,
                as: 'servicios'
            }],
            where: {
                deletedAt: {
                    [Op.ne]: null
                }
            },
            paranoid: false
        })
            .then(prov => {
                if (!prov) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron proveedores",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        prov,
                        "Listado de proveedores eliminados",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                res.status(500).json(
                    ResponseFormat.error(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrio un error al devolver el proveedor",
                        500,
                        "error"
                    )
                )
            }
            );
    },
    getPremium(req, res) {
        return proveedor.findOne({
            include: [{
                model: servicios,
                as: 'servicios'
            }],
            where: { tipo: 'Premium' }
        })
            .then(prov => {
                if (!prov) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontró al proveedor",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        prov,
                        "Listado de proveedor",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                res.status(500).json(
                    ResponseFormat.error(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrio un error al devolver el proveedor",
                        500,
                        "error"
                    )
                )
            }
            );
    },
    getSupervisados(req, res) {
        return proveedor
            .findAll({
                where: { tipo: 'Supervisado' },
                include: [{
                    model: servicios,
                    as: 'servicios'
                }]
            })
            .then(proveedor => {
                if (!proveedor) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron Proveedores",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        proveedor,
                        "Listado de Proveedores",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrio un error al devolver el listado de Proveedores",
                    500,
                    "error"
                )
            ));
    },
    create(req, res) {
        return proveedor
            .create({
                nombre: req.body.nombre,
                email: req.body.email,
                descripcion: req.body.descripcion,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                localidadId: req.body.localidadId,
                foto: req.file ? req.file.filename : null,
                usuarioId: req.body.usuarioId
            })
            .then(proveedor => res.status(201).json(ResponseFormat.build(
                proveedor,
                "Proveedor creado correctamente",
                201,
                "success"
            )))
            .catch(error => {
                //eliminar foto adjuntada si hubo errores de alta
                try {
                    if(req.file){
                        fs.unlinkSync(process.env.PATH_FILES_UPLOAD + req.file.filename);
                    }
                } catch (err) {
                    console.error(err)
                }
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se creaba el Proveedor",
                    "error"
                ));
            })
    },

    update(req, res) {
        return proveedor
            .findByPk(req.params.id, {
                include: [{
                    model: servicios,
                    as: 'servicios'
                },
                ]
            })
            .then(prov => {
                if (!prov) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            {},
                            "No se encuentra el proveedor",
                            404,
                            "error"
                        )
                    );
                }
                let foto = prov.foto;
                if (req.file) {
                    try {
                        fs.unlinkSync(process.env.PATH_FILES_UPLOAD + prov.foto);
                    } catch (err) {
                        console.error(err)
                    }
                    foto = req.file.filename
                }
                return prov
                    .update({
                        nombre: req.body.nombre,
                        email: req.body.email,
                        descripcion: req.body.descripcion,
                        direccion: req.body.direccion,
                        localidadId: req.body.localidadId,
                        telefono: req.body.telefono,
                        tipo: req.body.tipo != null ? req.body.tipo : 'Standar',
                        foto: foto,
                        usuarioId: req.body.usuarioId
                    })
                    .then(proveedor => res.status(201).json(ResponseFormat.build(
                        proveedor,
                        "Proveedor actualizado correctamente",
                        201,
                        "success"
                    )))
                    .catch(error => {
                        try {
                            if(req.file){
                                fs.unlinkSync(process.env.PATH_FILES_UPLOAD + req.file.filename);
                            }
                        } catch (err) {
                            console.error(err)
                        }
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba el Proveedor",
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
    updateTipo(req, res) {
        return proveedor
            .findByPk(req.params.id, {})
            .then(prov => {
                if (!prov) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            {},
                            "No se encuentra el proveedor",
                            404,
                            "error"
                        )
                    );
                }
                
                return prov
                    .update({
                        tipo: req.body.tipo != null ? req.body.tipo : 'Standar',
                    })
                    .then(proveedor => res.status(201).json(ResponseFormat.build(
                        proveedor,
                        "Proveedor actualizado correctamente",
                        201,
                        "success"
                    )))
                    .catch(error => {
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba el Proveedor",
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
        return proveedor
            .findAll({
                include: [{
                    model: servicios,
                    as: 'servicios'
                },
                ]
            })
            .then(proveedor => {
                if (!proveedor) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron Proveedores",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        proveedor,
                        "Listado de Proveedores",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrio un error al devolver el listado de Proveedores",
                    500,
                    "error"
                )
            ));
    },
    destroy(req, res, next) {
        return proveedor
            .findByPk(req.params.id)
            .then(proveedor => {
                if (!proveedor) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            "No se encuentra el Proveedor",
                            "Ocurrió un error cuando se eliminaba el Proveedor",
                            404,
                            "error"
                        )
                    );
                }
                servicios.destroy({
                    where: { proveedorid: req.params.id }
                })
                return proveedor
                    .destroy()
                    .then(() => res.status(200).json(
                        ResponseFormat.build(
                            {},
                            "Proveedor eliminado correctamente",
                            200,
                            "success"
                        )
                    ))
                    .catch(error => res.status(500).json(
                        ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se eliminaba el Proveedor",
                            500,
                            "error"
                        )
                    ));
            });
    },
    restore(req, res) {
        return proveedor
            .findByPk(req.params.id,  { paranoid: false } )
            .then(proveedor => {
                if (!proveedor) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            {},
                            "No se encuentra el proveedor",
                            404,
                            "error"
                        )
                    );
                }
                return proveedor
                    .restore()
                    .then(usuario => res.status(201).json(ResponseFormat.build(
                        usuario,
                        "Proveedor actualizado correctamente",
                        201,
                        "success"
                    )))
                    .catch(error => {
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba el Proveedor",
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
}