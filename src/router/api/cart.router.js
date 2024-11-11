import express from 'express'
import CartController from '../../controller/api/cart.controller.js';

import { verifyToken } from '../../midllewares/passportMiddle.js'

const router = express.Router()
const cartController = new CartController()

// Ruta para crear un nuevo carrito
router.post('/', cartController.createCart)

// Ruta para obtener un carrito por su ID
router.get('/:cartId', verifyToken, cartController.getCart);

// Ruta para eliminar el carrito
router.delete('/remove/:cartId', cartController.deleteCart);

// Ruta para agregar un producto al carrito
router.post('/:cartId/products/:productId',verifyToken, cartController.addToCart)

// Ruta para actualizar los productos en el carrito
router.put('/:cartId', cartController.updateCart)

// Ruta para actualizar la cantidad de un producto en el carrito
router.put('/:cartId/product/:productId', cartController.updateQuantity)

// Ruta para eliminar un producto del carrito
router.delete('/:cartId/products/:productId', cartController.removeFromCart)

// Ruta para vaciar el carrito
router.delete('/:cartId', cartController.emptyCart)

export default router