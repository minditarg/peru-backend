
const usuarioController = require('../controllers').usuario
const loginController = require('../controllers').login
const serviciosController = require('../controllers').servicios
const categoriasController = require('../controllers').categorias
const proveedoresController = require('../controllers').proveedores
const trabajosController = require('../controllers').trabajos
const clientesController = require('../controllers').clientes
const customMdw = require('../middleware/custom');
const uploadImage = require('../middleware/uploadImage');
const passport = require("passport");



module.exports = (app) => {
    // app.post('/api/users', userController.create);
    // app.get('/api/users', userController.list);
    // app.get('/api/users/comments', userController.listWithComment);
    // app.get('/api/users/:userId', userController.getUserDetails);
    // app.put('/api/users/:userId', userController.update);
    // app.delete('/api/users/:userId', userController.destroy);

    
    app.get('/api/servicio/:id', customMdw.ensureAuthenticated, serviciosController.get);
    app.get('/api/servicios', customMdw.ensureAuthenticated, serviciosController.list);
    app.post('/api/servicio', [customMdw.ensureAuthenticated, uploadImage.array('fotos',10)], serviciosController.create);
    app.post('/api/servicio/:id',[customMdw.ensureAuthenticated, uploadImage.array('fotos',10)], serviciosController.update);
    app.delete('/api/servicio/:id', customMdw.ensureAuthenticated, serviciosController.destroy);

    app.get('/api/categorias', customMdw.ensureAuthenticated, categoriasController.list);
    app.post('/api/categorias', customMdw.ensureAuthenticated, categoriasController.create);
    app.delete('/api/categorias/:id', customMdw.ensureAuthenticated, categoriasController.destroy);

    app.get('/api/proveedor/listado', customMdw.ensureAuthenticated, proveedoresController.list);
    app.post('/api/proveedor', [customMdw.ensureAuthenticated, uploadImage.single('foto')], proveedoresController.create);
    app.put('/api/proveedor/:id',[customMdw.ensureAuthenticated, uploadImage.single('foto')], proveedoresController.update);
    app.delete('/api/proveedor/:id', customMdw.ensureAuthenticated, proveedoresController.destroy);

    

    app.post('/api/login', loginController.login);
    app.post('/api/registrar', loginController.register);
    app.get('/api/auth/facebook', loginController.loginFacebook);
    app.get('/api/auth/facebook/callback', loginController.loginFacebookCallback);


    app.get('/api/usuario/perfil/:id', customMdw.ensureAuthenticated, usuarioController.get);
    app.get('/api/usuario/perfilPorToken/', customMdw.ensureAuthenticated, usuarioController.get);


    app.post('/api/trabajo', customMdw.ensureAuthenticated, trabajosController.create);
    app.get('/api/trabajo/:id', customMdw.ensureAuthenticated, trabajosController.get);
    app.get('/api/trabajo/listadoPorProveedor/:id', customMdw.ensureAuthenticated, trabajosController.list);
    app.delete('/api/trabajo/:id', customMdw.ensureAuthenticated, trabajosController.destroy);



     app.post('/api/cliente', customMdw.ensureAuthenticated, clientesController.create);
    // app.get('/api/cliente/:id', customMdw.ensureAuthenticated, clientesController.get);
    app.get('/api/cliente/listado', customMdw.ensureAuthenticated, clientesController.list);
    app.delete('/api/cliente/:id', customMdw.ensureAuthenticated, clientesController.destroy);

}

/* GET home page. */
