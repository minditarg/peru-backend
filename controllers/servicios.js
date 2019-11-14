const categoria = require('../db/models').Categoria;
const servicio = require('../db/models').Servicio;

const ServicioFoto = require('../db/models').ServicioFoto;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    create(req, res) {
        let fotoDestacada = req.body.foto != null ? req.body.foto[0] : null;
        if (req.body.foto != null) req.body.foto.shift();
        console.log(req.body.foto.length);
        return servicio
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                foto: fotoDestacada.foto,
                subcategoriaId: req.body.subcategoriaId,
                proveedorId: req.body.proveedorId,
                galeria: req.body.foto
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
            .catch(error => res.status(400).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error cuando se creaba el Servicio",
                "error"
            )))
    },
    list(req, res) {
        return servicio
            .findAll({
                include: [{
                    model: categoria,
                    as: 'categoria'
                }]
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
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.message,
                    "Ocurrio un error al devolver el listado de servicios",
                    500,
                    "error"
                )
            ));
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
                            error.message,
                            "Ocurrió un error cuando se eliminaba el Servicio",
                            500,
                            "error"
                        )
                    ));
            });
    }
}