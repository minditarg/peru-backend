const proveedor = require('../db/models').Proveedor;
const servicio = require('../db/models').Servicio;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    getByTipo (req, res) {
        return proveedor
        .findAll({
            include: [{
                model: servicio,
            }]
        })
        .then(proveedors => {
            if(!proveedors) {
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
                    proveedors,
                    "Listado de proveedores correctamente",
                    200,
                    "success"
                )
            )
        })
        .catch(error => res.status(500).json(
            ResponseFormat.error(
                error,
                "Ocurrio un error al devolver el listado de proveedores",
                500,
                "error"
            )
        ));
    }
}