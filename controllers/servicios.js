const categoria = require('../db/models').Categoria;
const servicio = require('../db/models').Servicio;

const ServicioFoto = require('../db/models').ServicioFoto;
const Subcategoria = require('../db/models').Subcategoria;
const Categoria = require('../db/models').Categoria;
const Localidad = require('../db/models').Localidad;
const ServicioVideos = require('../db/models').ServicioVideos;
const Trabajo = require('../db/models').Trabajo;
const Proveedor = require('../db/models').Proveedor;
const ResponseFormat = require('../core').ResponseFormat;
var Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');
module.exports = {
    get(req, res) {
        return servicio.findByPk(req.params.id, {
            attributes: ['id','nombre', 'descripcion', 'foto', [Sequelize.fn('AVG', Sequelize.col('trabajos.puntajeDelCliente')), 'puntaje']],
            group: ['id'],
            include: [
                {
                    model: Subcategoria,
                    as: "subcategoria",
                    include: [{ model: Categoria, as: "categoria" }]
                },
                {
                    model: ServicioFoto,
                    as: "galeria",
                },
                {
                    model: ServicioVideos,
                    as: "videos",
                },
                {
                    model: Proveedor
                },
                {
                    model: Trabajo,
                    as: 'trabajos',
                    attributes: []
                },
            ]
        })
            .then(servicio => res.status(201).json(ResponseFormat.build(
                servicio,
                "Detalle del servicio",
                201,
                "success"
            )))
            .catch(error => res.status(400).json(ResponseFormat.error(
                error.errors.map(err => err.message).join(", "),
                "Ocurrió un error al devolver el servicio",
                "error"
            )))
    },
    create(req, res) {
        let galeria = Array();
        let fotoPrincipal = null;
        let filesBack = req.files;
        if (req.files != null) {
            fotoPrincipal = filesBack.shift();
            filesBack.forEach(element => {
                galeria.push({ foto: element.filename });
            });
        }
        return servicio
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                foto: fotoPrincipal != null ? fotoPrincipal.filename : null,
                subcategoriaId: req.body.subcategoriaId,
                proveedorId: req.body.proveedorId,
                galeria: galeria
            }, {
                include: [{
                    association: "galeria",
                    as: 'galeria'
                }]
            })
            .then(servicio => res.status(201).json(ResponseFormat.build(
                servicio,
                "Servicio creado correctamente",
                201,
                "success"
            )))
            .catch(error => {
                try {
                    req.file.forEach(foto => {
                        fs.unlinkSync(process.env.PATH_FILES_UPLOAD + foto.filename);
                    });
                } catch (err) {
                    console.error(err)
                }
                console.log(error);
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se creaba el Servicio",
                    "error"
                ));
            })
    },
    update(req, res) {
        return servicio
            .findByPk(req.params.id, {
                include: [
                    {
                        model: ServicioFoto,
                        as: "galeria",
                    }
                ]
            })
            .then(serv => {
                if (!serv) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            {},
                            "No se encuentra el Servicio",
                            404,
                            "error"
                        )
                    );
                }
                let pathFotosEliminar = Array();
                if (serv.foto != null) pathFotosEliminar.push(serv.foto);
                serv.galeria.forEach(foto => {
                    pathFotosEliminar.push(foto.foto);
                });
                let galeria = Array();
                let fotoPrincipal = null;
                let filesBack = req.files;
                if (req.files != null) {
                    fotoPrincipal = filesBack.shift();
                    filesBack.forEach(element => {
                        galeria.push({ foto: element.filename });
                    });
                }
                return serv
                    .update({
                        nombre: req.body.nombre,
                        descripcion: req.body.descripcion,
                        foto: fotoPrincipal != null ? fotoPrincipal.filename : null,
                        subcategoriaId: req.body.subcategoriaId,
                        proveedorId: req.body.proveedorId,
                        galeria: galeria
                    }, {
                        include: [{
                            association: "galeria",
                            as: 'galeria'
                        }]
                    })
                    .then(serv => {
                        //elimino las fotos anteriores
                        galeria.forEach(img => {
                            ServicioFoto.create({ foto: img.foto, servicioId: serv.id });
                        });
                        try {
                            pathFotosEliminar.forEach(fotoPath => {
                                fs.unlinkSync(process.env.PATH_FILES_UPLOAD + fotoPath);
                            });
                        } catch (err) {
                            console.error(err)
                        }
                        ServicioFoto.destroy({
                            where: {
                                servicioId: req.params.id,
                                foto: {
                                    [Op.or]: pathFotosEliminar
                                }
                            }
                        });

                        return res.status(201).json(ResponseFormat.build(
                            serv,
                            "Servicio actualizado correctamente",
                            201,
                            "success"
                        ))
                    })
                    .catch(error => {
                        try {
                            fs.unlinkSync(process.env.PATH_FILES_UPLOAD + req.file.filename);
                        } catch (err) {
                            console.error(err)
                        }
                        // let errorMessage= error.name ==  "SequelizeForeignKeyConstraintError" ? ": la subcategoría es requerida" : "";
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba el Servicio",
                            "error"
                        ));
                    })
            })
            .catch(error => {
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se actualizaba el Servicio",
                    "error"
                ));
            })
    },
    list(req, res) {
        return servicio.findAll({
            attributes: ['id','nombre', 'descripcion', 'foto', [Sequelize.fn('AVG', Sequelize.col('trabajos.puntajeDelCliente')), 'puntaje']],
            include: [
                {
                    model: Subcategoria,
                    as: "subcategoria",
                    include: [{ model: Categoria, as: "categoria" }]
                },
                {
                    model: Trabajo,
                    as: 'trabajos',
                    attributes: []
                },
                {
                    model: Proveedor
                }

            ],
            group: ['servicio.id'],
            order: [[Sequelize.fn('AVG', Sequelize.col('trabajos.puntajeDelCliente')), 'DESC']]
        })
            // .findAll({
            //     include: [{
            //         model: categoria,
            //         as: 'categoria'
            //     }]
            // })
            .then(servicio => {
                if (!servicio) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron servicios",
                            404,
                            "error"
                        )
                    )
                }

                return res.status(200).json(
                    ResponseFormat.build(
                        servicio,
                        "Listado de servicios",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                console.log(error);
                res.status(500).json(
                    ResponseFormat.error(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrio un error al devolver el listado de servicios",
                        500,
                        "error"
                    )

                )

            }
            );
    },
    destroy(req, res) {
        return servicio
            .findById(req.params.id)
            .then(servicio => {
                if (!servicio) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            "No se encuentra el Servicio",
                            "Ocurrió un error cuando se eliminaba el Servicio",
                            404,
                            "error"
                        )
                    );
                }

                return servicio
                    .destroy()
                    .then(() => res.status(200).json(
                        ResponseFormat.build(
                            {},
                            "Servicio eliminado correctamente",
                            200,
                            "success"
                        )
                    ))
                    .catch(error => res.status(500).json(
                        ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se eliminaba el Servicio",
                            500,
                            "error"
                        )
                    ));
            });
    },
    buscar(req, res) {
        return servicio
            .findAll({

                attributes: ['id','nombre', 'descripcion', 'foto', [Sequelize.fn('AVG', Sequelize.col('trabajos.puntajeDelCliente')), 'puntaje']],
                include: [
                    {
                        model: Trabajo,
                        as: 'trabajos',
                        attributes: []
                    },
                    {
                        model: Subcategoria, as: 'subcategoria',
                        where: {
                            categoriaId: req.body.categoriaId,
                        },
                        required: typeof req.body.categoriaId !== 'undefined' && req.body.categoriaId != ""
                    },
                    {
                        model: Proveedor,
                        where: {
                            localidadId: req.body.localidadId,
                        },
                        required: typeof req.body.localidadId !== 'undefined' && req.body.localidadId != ""
                    }
                ],
                group: ['servicio.id'],
                order: [[Sequelize.fn('AVG', Sequelize.col('trabajos.puntajeDelCliente')), 'DESC']],
                where: {
                    ...(req.body.subcategoriaId && { subcategoriaId: req.body.subcategoriaId }),
                },
            })
            .then(servicio => {
                if (!servicio) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron servicios",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        servicio,
                        "Listado de servicios",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                console.log(error, "erorrr");
                return res.status(500).json(
                    ResponseFormat.error(
                        error,
                        "Ocurrio un error al devolver el resultado de servicios",
                        500,
                        "error"
                    )
                );
            });
    }
}