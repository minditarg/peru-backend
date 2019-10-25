const categoria = require('../db/models').Categoria;
const servicio = require('../db/models').Servicio;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    create(req, res) {
        return user
        .create({
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            categoriaId: req.body.categoriaId
        })
        .then(user => res.status(201).json(ResponseFormat.build(
            user,
            "Servicio Create Successfully",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error,
            "Something went wrong when create Servicio",
            "error"
        )))
    },
    getAll (req, res) {
        return servicio
        .findAll({
            include: [{
                model: categoria,
            }]
        })
        .then(servicio => {
            if(!servicio) {
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
                    "Listado de servicios correctamente",
                    200,
                    "success"
                )
            )
        })
        .catch(error => res.status(500).json(
            ResponseFormat.error(
                error,
                "Ocurrio un error al devolver el listado de servicios",
                500,
                "error"
            )
        ));
    }
}