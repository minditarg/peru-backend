const categoria = require('../db/models').Categoria;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    create(req, res) {
        return categoria
        .create({
            nombre: req.body.nombre,
        })
        .then(categoria => res.status(201).json(ResponseFormat.build(
            user,
            "Categoria Create Successfully",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error,
            "Something went wrong when create Categoria",
            "error"
        )))
    },
    getAll (req, res) {
        return categoria
        .findAll({
        })
        .then(categoria => {
            if(!categoria) {
                return res.status(404).json(
                    ResponseFormat.build(
                        {},
                        "No se encontraron categorias",
                        404,
                        "error"
                    )
                )
            }

            return res.status(200).json(
                ResponseFormat.build(
                    categoria,
                    "Listado de categorias correctamente",
                    200,
                    "success"
                )
            )
        })
        .catch(error => res.status(500).json(
            ResponseFormat.error(
                error,
                "Ocurrio un error al devolver el listado de categorias",
                500,
                "error"
            )
        ));
    }
}