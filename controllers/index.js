const login = require('./login');
const servicios = require('./servicios');
const categorias = require('./categorias');
const proveedores = require('./proveedores');
const usuario = require('./usuario');
const trabajos = require('./trabajos');
const clientes = require('./clientes');
const localidades = require('./localidades');

const subcategorias = require('./subcategorias');

module.exports = {
    login,
    servicios,
    categorias,
    proveedores,
    trabajos,
    clientes,
    usuario,
    localidades,
    subcategorias
}