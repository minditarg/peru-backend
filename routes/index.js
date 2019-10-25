
const userController = require('../controllers').users
const commentController = require('../controllers').comments
const proveedorController = require('../controllers').proveedors

module.exports = (app) => {
  app.post('/api/users', userController.create);
  app.get('/api/users', userController.list);
  app.get('/api/users/comments', userController.listWithComment);
  app.get('/api/users/:userId', userController.getUserDetails);
  app.put('/api/users/:userId', userController.update);
  app.delete('/api/users/:userId', userController.destroy);

  app.get('/api/proveedores', proveedorController.getByTipo);
  
  app.get('/api/servicios', serviciosController.getAll);
  app.post('/api/servicios', serviciosController.create);

    
  app.get('/api/categorias', categoriasController.getAll);
  app.post('/api/categorias', categoriasController.create);
}
/* GET home page. */
