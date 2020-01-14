const localidadesService = require('../db/models').Localidad;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {

    list(req, res) {
        return localidadesService
            .findAll()
            .then(localidades => {
                if (!localidades) {
                    return res.status(404).json(
                        ResponseFormat.build(
                            {},
                            "No se encontraron Localidades",
                            404,
                            "error"
                        )
                    )
                }
                return res.status(200).json(
                    ResponseFormat.build(
                        localidades,
                        "Listado de Localidades",
                        200,
                        "success"
                    )
                )
            })
            .catch(error => {
                console.log(error, "error");
                return res.status(500).json(
                    ResponseFormat.error(
                        error.errors.map(err => err.message).join(", "),
                        "Ocurrio un error al devolver el listado de Localidades",
                        500,
                        "error"
                    )
                )
            }
            );
    },
    create(req, res) { 
        return localidadesService
        .create({
            nombre: req.body.nombre,
        })
        .then(localidad => res.status(201).json(ResponseFormat.build(
            localidad,
            "Localidad creada correctamente",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error.errors.map(err => err.message).join(", "),
            "Ocurrió un error cuando se creaba la Localidad",
            "error"
        )))
    },
    update(req, res) {
        return localidadesService
            .findByPk(req.params.id)
            .then(localidad => {
                if (!localidad) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            {},
                            "No se encuentra la Localidad",
                            404,
                            "error"
                        )
                    );
                }
                return localidadesService
                    .update({
                        nombre: req.body.nombre,
                    })
                    .then(localidad => res.status(201).json(ResponseFormat.build(
                        localidad,
                        "Localidad actualizada correctamente",
                        201,
                        "success"
                    )))
                    .catch(error => {
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba la Localidad",
                            "error"
                        ));
                    })
            })
            .catch(error => {
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se actualizaba la Localidad",
                    "error"
                ));
            })
    },
    destroy (req, res) {
        return localidadesService
        .findById(req.params.id)
        .then(localidad => {
            if(!localidad) {
                return res.status(404).json(
                    ResponseFormat.error(
                        "No se encuentra la Localidad",
                        "Ocurrió un error cuando se eliminaba la Localidad",
                        404,
                        "error"
                    )
                );
            }

            return localidadesService
            .destroy()
            .then(() => res.status(200).json(
               ResponseFormat.build(
                 {},
                 "Localidad eliminada correctamente",
                 200,
                 "success"
               )
            ))
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se eliminaba la Localidad"  ,
                    500,
                    "error"
                )
            ));
        });
    }
}