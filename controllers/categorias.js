const categoria = require('../db/models').Categoria;
const subcategoria = require('../db/models').Subcategoria;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    create(req, res) { 
        return categoria
        .create({
            nombre: req.body.nombre,
        })
        .then(categoria => res.status(201).json(ResponseFormat.build(
            categoria,
            "Categoría creada correctamente",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error.errors.map(err => err.message).join(", "),
            "Ocurrió un error cuando se creaba la Categoría",
            "error"
        )))
    },
    list (req, res) {
        return categoria
        .findAll({
            include: [
                {
                    model: subcategoria, as : "subcategorias"
                }]
        })
        .then(categoria => {
            if(!categoria) {
                return res.status(404).json(
                    ResponseFormat.build(
                        {},
                        "No se encontraron Categorías",
                        404,
                        "error"
                    )
                )
            }
            return res.status(200).json(
                ResponseFormat.build(
                    categoria,
                    "Listado de Categorías",
                    200,
                    "success"
                )
            )
        })
        .catch(error => res.status(500).json(
            ResponseFormat.error(
                error.errors.map(err => err.message).join(", "),
                "Ocurrio un error al devolver el listado de Categorías",
                500,
                "error"
            )
        ));
    },
    destroy (req, res) {
        return categoria
        .findById(req.params.id)
        .then(categoria => {
            if(!categoria) {
                return res.status(404).json(
                    ResponseFormat.error(
                        "No se encuentra la categoría",
                        "Ocurrió un error cuando se eliminaba la Categoría",
                        404,
                        "error"
                    )
                );
            }

            return categoria
            .destroy()
            .then(() => res.status(200).json(
               ResponseFormat.build(
                 {},
                 "Categoría eliminada correctamente",
                 200,
                 "success"
               )
            ))
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se eliminaba la Categoría"  ,
                    500,
                    "error"
                )
            ));
        });
    }
}