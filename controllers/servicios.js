const categoria = require('../db/models').Categoria;
const servicio = require('../db/models').Servicio;

const ServicioFoto = require('../db/models').ServicioFoto;
const ResponseFormat = require('../core').ResponseFormat;
module.exports = {
    create(req, res) {
        let galeria = Array();
        let fotoPrincipal = null;
        let filesBack= req.files;
        if (req.files != null) {
            fotoPrincipal =filesBack.shift();
            filesBack.forEach(element => {
                galeria.push({ foto: element.filename });
            });
        }
        return servicio
            .create({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                foto: fotoPrincipal != null ? fotoPrincipal.filename : null,
                subcategoriaId: req.body.subcategoriaId,
                proveedorId: req.body.proveedorId,
                galeria: galeria
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
            .catch(error => {
                try {
                    req.file.forEach(foto => {
                        fs.unlinkSync(process.env.PATH_FILES_UPLOAD + foto.filename);
                    });
                } catch (err) {
                    console.error(err)
                }
                return res.status(400).json(ResponseFormat.error(
                    error.message,
                    "Ocurrió un error cuando se creaba el Servicio " + error.message,
                    "error"
                ));
            })
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
    // create(req, res) {
    //     let galeria = Array();
    //     if (req.body.foto != null) {
    //         req.body.foto.forEach(element => {
    //             console.log(element);
    //             var base64Data = element.foto.replace('/^data:image\/png;base64,/', "");
    //             nombreFoto = Date.now() + ".png";
    //             galeria.push( { foto :  nombreFoto } );
    //             require("fs").writeFile(process.env.PATH_FILES_UPLOAD + nombreFoto, base64Data, 'base64', function (err) {
    //                 console.log(err);
    //             });
    //         });
    //     }

    //     let fotoDestacada = req.body.foto != null ? galeria[0] : null;
    //     if (req.body.foto != null) galeria.shift();

    //     return servicio
    //         .create({
    //             nombre: req.body.nombre,
    //             descripcion: req.body.descripcion,
    //             foto: fotoDestacada.foto,
    //             subcategoriaId: req.body.subcategoriaId,
    //             proveedorId: req.body.proveedorId,
    //             galeria: req.body.foto
    //         }, {
    //             include: [{

    //                 association: "galeria",
    //                 as: 'galeria'
    //             }]
    //         })
    //         .then(servicio => res.status(201).json(ResponseFormat.build(
    //             servicio,
    //             "Servicio creado correctamente",
    //             201,
    //             "success"
    //         )))
    //         .catch(error => res.status(400).json(ResponseFormat.error(
    //             error.message,
    //             "Ocurrió un error cuando se creaba el Servicio",
    //             "error"
    //         )))
    // },
}