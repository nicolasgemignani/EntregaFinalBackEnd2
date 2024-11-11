import { Router } from 'express'
import ViewController from '../controller/view.controller.js'

import { passportCall, verifyToken } from '../midllewares/passportMiddle.js'
import { authorization } from '../midllewares/authorization.js'
import uploader from '../utils/multer.js'

const router = Router()
const viewController = new ViewController()

// Ruta para el registro
router.get('/register', viewController.registro)

// Ruta para el login
router.get('/login', viewController.login)

// Ruta para obtener productos con paginacion
router.get('/products', verifyToken, viewController.paginateProducts);

// Ruta para agregar productos al carrito
router.post('/cart/add/:productId', verifyToken, passportCall('jwt', { session: false }), authorization('user'), viewController.addToCart)

// Ruta para el formulario que agrega productos
router.get('/add-products', viewController.form)
router.post('/addProducts', uploader.single('thumbnail') ,verifyToken, passportCall('jwt', { session: false }), authorization('admin'), viewController.addProduct)

router.get('/edit-product/:id', viewController.productId)
router.post('/products/:id/update', uploader.single('thumbnail'), verifyToken, passportCall('jwt', { session: false }), authorization('admin'), viewController.updateProduct)

router.post('/products/:id/delete', verifyToken, passportCall('jwt', { session: false }), authorization('admin'), viewController.deleteProduct);

/* Carrito */

router.get('/carrito/:id',verifyToken, viewController.getCart)

export default router