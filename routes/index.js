
const usuarioController = require('../controllers').usuario
const loginController = require('../controllers').login
const serviciosController = require('../controllers').servicios
const categoriasController = require('../controllers').categorias
const proveedoresController = require('../controllers').proveedores
const customMdw = require('../middleware/custom');
const passport = require("passport");

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


  app.get('/api/proveedores',customMdw.ensureAuthenticated, proveedoresController.list);
  app.post('/api/proveedores',customMdw.ensureAuthenticated, proveedoresController.create);
  app.delete('/api/proveedores/:id',customMdw.ensureAuthenticated, proveedoresController.destroy);



  app.post('/api/login', loginController.login);
  app.post('/api/registrar', loginController.register);
  app.get('/api/auth/facebook', loginController.loginFacebook);
  app.get('/api/auth/facebook/callback',loginController.loginFacebookCallback);


  app.get('/api/usuario/perfil',customMdw.ensureAuthenticated, usuarioController.get);



}

/* GET home page. */
