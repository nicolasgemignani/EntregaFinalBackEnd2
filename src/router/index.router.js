import { Router} from 'express'

import sessionRouter from './api/session.router.js'
import productRouter from './api/product.router.js'
import cartRouter from './api/cart.router.js'
import userRouter from './api/user.router.js'

const router = Router()

// Redirige las solicitudes a '/api/sessions' al enrutador de productos
router.use('/api/sessions', sessionRouter)

// Redirige las solicitudes a '/api/products' al enrutador de productos
router.use('/api/products', productRouter)

// Redirige las solicutdes a '/api/carts' al enrutador de carritos
router.use('/api/carts', cartRouter)

// Redirige las solicitudes a '/api/user' al enrutador de productos
router.use('/api/users', userRouter)

// Exporta el enrutador para que pueda ser usado en otros modulos
export default router