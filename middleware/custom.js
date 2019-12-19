'use strict'
const passport          = require('passport');
const error_types       = require('../core/error_types');
const ResponseFormat = require('../core').ResponseFormat;
let middlewares = {
    
    /*
    Este middleware va *antes* de las peticiones.
    passport.authenticate de jwt por defecto añade en req.user el objeto que devolvamos desde
    el callback de verificación de la estrategia jwt.
    En nuestro caso hemos personalizado el auth_callback de authenticate y
    aunque también inyectamos ese dato en req.user, aprovechamos y personalizaremos las respuestas
    para que sean tipo json.
    */
    ensureAuthenticated: (req,res,next)=>{
        passport.authenticate('jwt', {session: false}, (err, user, info)=>{
            //si hubo un error relacionado con la validez del token (error en su firma, caducado, etc)
            if(info){
                //return next(new error_types.Error401(info.message)); 
                return res.status(200).json(ResponseFormat.error(
                    info.message,
                    "Token no válido",
                    401,
                    "error"
                ))
                }

            //si hubo un error en la consulta a la base de datos
            if (err) { 
                //return next(err);
                return res.status(200).json(ResponseFormat.error(
                    info.message,
                    "Token no válido",
                    401,
                    "error"
                ))
            }

            //si el token está firmado correctamente pero no pertenece a un usuario existente
            if (!user) { 
                //return next(new error_types.Error403("No tienes acceso.")); 
                return res.status(200).json(ResponseFormat.error(
                    "No tienes acceso",
                    "No tienes acceso",
                    403,
                    "error"
                ))
            }
            
            //inyectamos los datos de usuario en la request
            req.user = user;
            next();
        })(req, res, next);
    },

    /*
    Este middleware va al final de todos los middleware y rutas.
    middleware de manejo de errores.
    */
    errorHandler: (error, req, res, next) => {
        console.log("ejecutando middleware de control de errores");
        if(error instanceof error_types.InfoError)
            //res.status(200).json({error: error.message});
            res.status(200).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error",
                "error"
            ));
        else if(error instanceof error_types.Error404)
            //res.status(404).json({error: error.message});
            res.status(404).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error",
                "error"
            ));
        else if(error instanceof error_types.Error403)
            //res.status(403).json({error: error.message});
            res.status(403).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error",
                "error"
            ));
        else if(error instanceof error_types.Error401)
            //res.status(401).json({error: error.message});
            res.status(401).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error",
                "error"
            ));
        else if(error.name == "ValidationError") //de mongoose
            //res.status(200).json({error: error.message});
            res.status(200).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error",
                "error"
            ));
            
        else if(error.message)
            //res.status(500).json({error: error.message});
            res.status(500).json(ResponseFormat.error(
                error.message,
                "Ocurrió un error",
                "error"
            ));
        else
            next();
    },

    /*
    Este middleware va al final de todos los middleware y rutas.
    middleware para manejar notFound
    */
    notFoundHandler: (req, res, next) => {
        console.log("ejecutando middleware para manejo de endpoints no encontrados");
        res.status(404).json({error: "endpoint not found"});
    }
}
    

module.exports = middlewares;