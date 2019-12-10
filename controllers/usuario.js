const usuario = require('../db/models').Usuario;
const Proveedor = require('../db/models').Proveedor;
const Cliente = require('../db/models').Cliente;
const Servicio = require('../db/models').Servicio;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    get(req, res) {
        return usuario.findByPk(req.user.dataValues.id,{
            include: [
                {
                    model: Proveedor,
                    include:[{model: Servicio, as: "servicios" }]
                  
                },
                {
                    model: Cliente
                }
            ]
        })
        .then(usuario => res.status(201).json(ResponseFormat.build(
            usuario,
            "Detalle del Usuario",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error.message,
            "Ocurrió un error al devolver el Usuario:"  + error.errors.map(err => err.message).join(", "),
            "error"
        )))
    },
 
    
    
}