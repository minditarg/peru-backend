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

}