
const usuarioController = require('../controllers').usuario
const loginController = require('../controllers').login
const serviciosController = require('../controllers').servicios
const categoriasController = require('../controllers').categorias
const proveedoresController = require('../controllers').proveedores
const customMdw = require('../middleware/custom');
const passport = require("passport");


var express= require("express");
var ImageRouter= express.Router();
const multer = require("multer");


const storage= multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req,file,cb){
        cb(null,  file.originalname);
    }
});

const fileFilter= (req, file,cb) => {
    if(file.mimetype==="image/jpeg" || file.mimetype==="image/png"){
        cb(null,true);
    }else{
        cb(null,false);
    }
}
const upload2 =  multer({
    storage: storage,
    limits:{
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
    onError : function(err, next) {
      console.log('error', err);
      next(err);
    }
});
var upload = multer({
  storage: storage,
  limits:{
      fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter,
 } ).single('foto');

module.exports = (app) => {
  // app.post('/api/users', userController.create);
  // app.get('/api/users', userController.list);
  // app.get('/api/users/comments', userController.listWithComment);
  // app.get('/api/users/:userId', userController.getUserDetails);
  // app.put('/api/users/:userId', userController.update);
  // app.delete('/api/users/:userId', userController.destroy);

  app.get('/api/servicios',customMdw.ensureAuthenticated, serviciosController.list);
  app.post('/api/servicios', customMdw.ensureAuthenticated,serviciosController.create);
  app.delete('/api/servicios/:id', customMdw.ensureAuthenticated,serviciosController.destroy);

  app.get('/api/categorias',customMdw.ensureAuthenticated, categoriasController.list);
  app.post('/api/categorias',customMdw.ensureAuthenticated, categoriasController.create);
  app.delete('/api/categorias/:id',customMdw.ensureAuthenticated, categoriasController.destroy);

  app.get('/api/proveedor/listado',customMdw.ensureAuthenticated, proveedoresController.list);
app.post('/api/proveedor', [  upload2.single('foto')], proveedoresController.create);



// app.post('/api/proveedor', upload2.single('foto'), (req, res) => {
//   console.log('file', req.files);
//   console.log('body', req.body);
//   res.status(200).json({
//     message: 'success!',
//   });
// });

// app.post('/api/proveedor', (res, req) => {
//   console.log(req.files)
//   });


  // app.post('/api/proveedor', function (req, res) {
  //   upload(req, res, function (err) {
  //     console.log(err);
  //     if (err instanceof multer.MulterError) {
  //       console.log(err);
  //       // A Multer error occurred when uploading.
  //     } else if (err) {
  //       console.log(err);
  //       // An unknown error occurred when uploading.
  //     }
  
  //     // Everything went fine.
  //   })
  // })




  app.delete('/api/proveedor/:id',customMdw.ensureAuthenticated, proveedoresController.destroy);


  app.post('/api/login', loginController.login);
  app.post('/api/registrar', loginController.register);
  app.get('/api/auth/facebook', loginController.loginFacebook);
  app.get('/api/auth/facebook/callback',loginController.loginFacebookCallback);


  app.get('/api/usuario/perfil',customMdw.ensureAuthenticated, usuarioController.get);



}

/* GET home page. */
