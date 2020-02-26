const categoria = require('../db/models').Categoria;
const subcategoria = require('../db/models').Subcategoria;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    create(req, res) { 
        return subcategoria
        .create({
            nombre: req.body.nombre,
            categoriaId: req.body.categoriaId
        })
        .then(subcategoria => res.status(201).json(ResponseFormat.build(
            subcategoria,
            "Subcategoría creada correctamente",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error.errors.map(err => err.message).join(", "),
            "Ocurrió un error cuando se creaba la Subcategoría",
            "error"
        )))
    },
    update(req, res) {
        return subcategoria
            .findByPk(req.params.id)
            .then(subcategoria => {
                if (!subcategoria) {
                    return res.status(404).json(
                        ResponseFormat.error(
                            {},
                            "No se encuentra la Subcategoría",
                            404,
                            "error"
                        )
                    );
                }
              
                return subcategoria
                    .update({
                        nombre: req.body.nombre,
                        categoriaId: req.body.categoriaId
                    })
                    .then(subcategoria => res.status(201).json(ResponseFormat.build(
                        subcategoria,
                        "Subcategoría actualizada correctamente",
                        201,
                        "success"
                    )))
                    .catch(error => {
                        return res.status(400).json(ResponseFormat.error(
                            error.errors.map(err => err.message).join(", "),
                            "Ocurrió un error cuando se actualizaba la Subcategoría",
                            "error"
                        ));
                    })
            })
            .catch(error => {
                return res.status(400).json(ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se actualizaba la Subcategoría",
                    "error"
                ));
            })
    },
    list (req, res) {
        return subcategoria
        .findAll({
            include: [
                {
                    model: categoria, as : "categoria"
                }]
        })
        .then(subcategoria => {
            if(!subcategoria) {
                return res.status(404).json(
                    ResponseFormat.build(
                        {},
                        "No se encontraron Subcategorías",
                        404,
                        "error"
                    )
                )
            }
            return res.status(200).json(
                ResponseFormat.build(
                    subcategoria,
                    "Listado de Subcategorías",
                    200,
                    "success"
                )
            )
        })
        .catch(error => res.status(500).json(
            ResponseFormat.error(
                error,
                //,error.errors.map(err => err.message).join(", "),
                "Ocurrio un error al devolver el listado de Subcategorías",
                500,
                "error"
            )
        ));
    },
    destroy (req, res) {
         subcategoria
        .findById(req.params.id)
        .then(subcategoria => {
            if(!subcategoria) {
                return res.status(404).json(
                    ResponseFormat.error(
                        "No se encuentra la Subcategorías",
                        "Ocurrió un error cuando se eliminaba la Subcategorías",
                        404,
                        "error"
                    )
                );
            }

            return subcategoria
            .destroy()
            .then(() => res.status(200).json(
               ResponseFormat.build(
                 {},
                 "Subcategorías eliminada correctamente",
                 200,
                 "success"
               )
            ))
            .catch(error => res.status(500).json(
                ResponseFormat.error(
                    error.errors.map(err => err.message).join(", "),
                    "Ocurrió un error cuando se eliminaba la Subcategorías"  ,
                    500,
                    "error"
                )
            ));
        });
    }
}