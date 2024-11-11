import express from 'express'
import ProductController from '../../controller/api/product.controller.js';
import { passportCall, verifyToken } from '../../midllewares/passportMiddle.js';
import { authorization } from '../../midllewares/authorization.js';

const router = express.Router()
const productController = new ProductController()
// Ruta para crear un nuevo producto
router.post('/', productController.createProduct)

// Ruta para obtener productos con paginacion, ordenamiento y filtros
router.get('/', productController.getAllProducts);

// Ruta para obtener un producto por su ID
router.get('/:id', productController.getProduct)

// Ruta para actualizar un producto por su ID
router.put('/:id', passportCall('jwt', { session: false }), authorization('admin'), productController.updateProduct)

// Ruta para eliminar un producto por su ID
router.delete('/:id', passportCall('jwt', { session: false }), authorization('admin'), productController.deleteProduct)

export default router