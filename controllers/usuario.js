const usuario = require('../db/models').Usuario;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    get(req, res) {
        return usuario.findByPk(req.user.dataValues.id)
        .then(usuario => res.status(201).json(ResponseFormat.build(
            usuario,
            "Detalle del Usuario",
            201,
            "success"
        )))
        .catch(error => res.status(400).json(ResponseFormat.error(
            error.message,
            "Ocurrió un error al devolver el Usuario",
            "error"
        )))
    },
 
    
    
}