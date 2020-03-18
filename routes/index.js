
const usuarioController = require('../controllers').usuario
const loginController = require('../controllers').login
const serviciosController = require('../controllers').servicios
const categoriasController = require('../controllers').categorias
const subcategoriasController = require('../controllers').subcategorias
const proveedoresController = require('../controllers').proveedores
const trabajosController = require('../controllers').trabajos
const clientesController = require('../controllers').clientes
const localidadesController = require('../controllers').localidades
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


    app.get('/api/localidades', localidadesController.list);
    app.post('/api/localidades',customMdw.ensureAuthenticated, localidadesController.create);
    app.delete('/api/localidades/:id', customMdw.ensureAuthenticated, localidadesController.destroy);
    app.put('/api/localidades/:id', customMdw.ensureAuthenticated, localidadesController.update);


    app.get('/api/servicio/:id', serviciosController.get);
    app.get('/api/servicios', customMdw.ensureAuthenticated, serviciosController.list);
    app.post('/api/servicio', [customMdw.ensureAuthenticated, uploadImage.array('fotos', 10)], serviciosController.create);
    app.post('/api/servicio/:id', [customMdw.ensureAuthenticated, uploadImage.array('fotos', 10)], serviciosController.update);
    app.delete('/api/servicio/:id', customMdw.ensureAuthenticated, serviciosController.destroy);
    app.get('/api/servicios/listadoPorProveedor/:id', serviciosController.listadoPorProveedor);
    
    app.post('/api/servicios/buscar', serviciosController.buscar);

    app.get('/api/categorias', categoriasController.list);
    app.post('/api/categorias', customMdw.ensureAuthenticated, categoriasController.create);
    app.delete('/api/categorias/:id', customMdw.ensureAuthenticated, categoriasController.destroy);
    app.put('/api/categorias/:id', customMdw.ensureAuthenticated, categoriasController.update);

    app.get('/api/subcategorias', subcategoriasController.list);
    app.post('/api/subcategorias', customMdw.ensureAuthenticated, subcategoriasController.create);
    app.delete('/api/subcategorias/:id', customMdw.ensureAuthenticated, subcategoriasController.destroy);
    app.put('/api/subcategorias/:id', customMdw.ensureAuthenticated, subcategoriasController.update);


    app.get('/api/proveedor/:id', proveedoresController.get);
    app.get('/api/proveedores/listado', customMdw.ensureAuthenticated,proveedoresController.list);
    app.get('/api/proveedores/eliminados', customMdw.ensureAuthenticated, proveedoresController.listEliminados);
    app.get('/api/proveedores/premium', proveedoresController.getPremium);
    app.get('/api/proveedores/supervisados', proveedoresController.getSupervisados);

    app.post('/api/proveedor', [customMdw.ensureAuthenticated, uploadImage.single('foto')], proveedoresController.create);
    app.put('/api/proveedor/:id', [customMdw.ensureAuthenticated, uploadImage.single('foto')], proveedoresController.update);
    app.delete('/api/proveedor/:id', customMdw.ensureAuthenticated, proveedoresController.destroy);
    app.post('/api/proveedor/restaurar/:id', customMdw.ensureAuthenticated, proveedoresController.restore);
    app.post('/api/proveedor/cambiarTipo/:id', customMdw.ensureAuthenticated, proveedoresController.updateTipo);

    
    
    app.post('/api/loginWeb', loginController.loginWeb);
    app.post('/api/login', loginController.login);
    app.post('/api/registrar', loginController.register);
    app.get('/api/auth/facebook', loginController.loginFacebook);
    app.get('/api/auth/facebook/callback', loginController.loginFacebookCallback);

    app.get('/api/auth/google', loginController.loginGoogle);
    app.get('/api/auth/google/callback', loginController.loginGoogleCallback);

    app.get('/api/usuario/perfil/:id', customMdw.ensureAuthenticated, usuarioController.get);
    app.get('/api/usuario/perfilPorToken/', customMdw.ensureAuthenticated, usuarioController.get);

     app.post('/api/usuario/recuperarPassword/', usuarioController.recuperarPassword);
     app.post('/api/usuario/cambiarPassword/', usuarioController.cambiarPassword);

    app.post('/api/trabajo', customMdw.ensureAuthenticated, trabajosController.create);
    app.get('/api/trabajo/:id', customMdw.ensureAuthenticated, trabajosController.get);
    app.get('/api/trabajo/listadoPorProveedor/:id', customMdw.ensureAuthenticated, trabajosController.list);
    app.delete('/api/trabajo/:id', customMdw.ensureAuthenticated, trabajosController.destroy);
    app.post('/api/trabajo/puntuarTrabajo', customMdw.ensureAuthenticated, trabajosController.puntuarTrabajo);


    app.get('/api/trabajo/listadoPorClienteCalificados/:id', customMdw.ensureAuthenticated, trabajosController.listadoPorClienteCalificados);
    app.get('/api/trabajo/listadoPorClienteSinCalificar/:id', customMdw.ensureAuthenticated, trabajosController.listadoPorClienteSinCalificar);

    app.post('/api/cliente', customMdw.ensureAuthenticated, clientesController.create);
    app.get('/api/cliente/listado', customMdw.ensureAuthenticated, clientesController.list);
    app.get('/api/cliente/eliminados', customMdw.ensureAuthenticated, clientesController.listEliminados);
    app.delete('/api/cliente/:id', customMdw.ensureAuthenticated, clientesController.destroy);
    app.post('/api/cliente/restaurar/:id', customMdw.ensureAuthenticated, clientesController.restore);
    app.get('/api/cliente/:id', customMdw.ensureAuthenticated, clientesController.get);
    app.put('/api/cliente/:id', [customMdw.ensureAuthenticated, uploadImage.single('foto')], clientesController.update);


}

/* GET home page. */
