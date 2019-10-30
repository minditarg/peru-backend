const proveedor = require('../db/models').Proveedor;
const servicios = require('../db/models').Servicio;
const categorias = require('../db/models').Categoria;
const db = require('../db/models').db;
const ResponseFormat = require('../core').ResponseFormat;
const error_types = require('../core/error_types');
module.exports = {
    create(req, res) {
        return proveedor
            .create({
                nombre: req.body.nombre,
                email: req.body.email,
                descripcion: req.body.descripcion,
                direccion: req.body.direccion,
                telefono: req.body.telefono,
                foto: req.body.foto,
                usuarioId:req.body.usuarioId
            })
            .then(proveedor => res.status(201).json(ResponseFormat.build(
                proveedor,
                "Proveedor creado correctamente",
                201,
                "success"
            )))
            .catch(error => res.status(400).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error cuando se creaba el Proveedor",
                "error"
            )))
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
                    error.message,
                    "Ocurrio un error al devolver el listado de Proveedores",
                    500,
                    "error"
                )
            ));
    },
    destroy(req, res, next) {
        return proveedor
            .findById(req.params.id)
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
                            error.message,
                            "Ocurrió un error cuando se eliminaba el Proveedor",
                            500,
                            "error"
                        )
                    ));
            });

    }
}