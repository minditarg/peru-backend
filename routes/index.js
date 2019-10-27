
const userController = require('../controllers').users

const serviciosController = require('../controllers').servicios
const categoriasController = require('../controllers').categorias
const proveedoresController = require('../controllers').proveedores


module.exports = (app) => {
  app.post('/api/users', userController.create);
  app.get('/api/users', userController.list);
  app.get('/api/users/comments', userController.listWithComment);
  app.get('/api/users/:userId', userController.getUserDetails);
  app.put('/api/users/:userId', userController.update);
  app.delete('/api/users/:userId', userController.destroy);

  app.get('/api/servicios', serviciosController.list);
  app.post('/api/servicios', serviciosController.create);
  app.delete('/api/servicios/:id', serviciosController.destroy);
    
  app.get('/api/categorias', categoriasController.list);
  app.post('/api/categorias', categoriasController.create);
  app.delete('/api/categorias/:id', categoriasController.destroy);

  
  app.get('/api/proveedores', proveedoresController.list);
  app.post('/api/proveedores', proveedoresController.create);
  app.delete('/api/proveedores/:id', proveedoresController.destroy);
}
/* GET home page. */
