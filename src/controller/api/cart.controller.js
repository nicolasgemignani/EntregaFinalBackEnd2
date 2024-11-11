import { cartService } from "../../service/index.service.js";

class CartController {
    constructor(){
        this.cartService = cartService
    }

    createCart = async (req, res) => {
        try {
            const userId = req.user._id; // Obtener el ID del usuario autenticado
    
            // Llamar al método create para crear un nuevo carrito
            const cart = await cartService.create(userId);
    
            // Responde con el ID del nuevo carrito
            res.json({ cartId: cart._id });
        } catch (error) {
            console.error('Error creando el carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'No se pudo crear el carrito'
            });
        }
    };

    getCart = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        
        try {
            const cart = await cartService.getCart(req.user.id);
            res.json({ status: 'success', payload: cart });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al obtener el carrito', error: error.message });
        }
    }

    deleteCart = async (req, res) => {
        const { cartId } = req.params
    
        try {
            const result = await cartService.deleteCart(cartId)
            res.json(result)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }

    addToCart = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        try {
            const { productId, quantity } = req.body;
            const updatedCart = await this.cartService.addToCart(req.user.id, productId, quantity);
            res.json({ status: 'success', payload: updatedCart });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito', error: error.message });
        }
    }

    updateCart = async (req, res) => {
        try {
            const { cartId } = req.params
            const newProducts = req.body // El cuerpo debe ser un arreglo de productos [{ product: 'productId', quantity: 1 }, ...]
    
            // Validar que newProducts sea un arreglo de objetos con los campos necesarios
            if (!Array.isArray(newProducts) || newProducts.some(p => !p.product || !p.quantity)) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Formato de productos inválido. Debe ser un arreglo de objetos con los campos "product" y "quantity".'
                })
            }
    
            // Llamar al método updateCartProducts para actualizar los productos del carrito
            const updatedCart = await cartService.updateCart(cartId, newProducts)
    
            res.status(200).json({
                status: 'success',
                message: 'Carrito actualizado exitosamente',
                payload: updatedCart
            });
        } catch (error) {
            console.error('Error actualizando los productos del carrito:', error)
            res.status(500).json({
                status: 'error',
                message: 'No se pudo actualizar el carrito'
            })
        }
    }

    updateQuantity = async (req, res) => {
        const { cartId, productId } = req.params
        const { quantity } = req.body
    
        try {
            // Validar que quantity sea un numero positivo
            if (typeof quantity !== 'number' || quantity <= 0) {
                return res.status(400).json({ error: 'La cantidad debe ser un número positivo' })
            }
    
            // Llamar al servicio para actualizar la cantidad del producto
            const updatedCart = await cartService.updateQuantity(cartId, productId, quantity)
    
            // Verificar si se devolvió un carrito actualizado
            if (!updatedCart) {
                return res.status(404).json({ error: 'Carrito o producto no encontrado' })
            }
    
            // Responder con el carrito actualizado
            res.status(200).json({
                status: 'success',
                payload: updatedCart
            });
        } catch (error) {
            // Manejar y responder con errores
            console.error('Error al actualizar la cantidad del producto:', error)
            res.status(500).json({ error: 'No se pudo actualizar la cantidad del producto' })
        }
    }

    removeFromCart = async (req, res) => {
        try {
            const { cartId, productId } = req.params

            const updatedCart = await cartService.removeFromCart(cartId, productId)
    
            if (!updatedCart) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Carrito o producto no encontrado'
                })
            }
    
            res.status(200).json({
                status: 'success',
                message: 'Producto eliminado del carrito exitosamente',
                payload: updatedCart
            })
        } catch (error) {
            console.error('Error eliminando el producto del carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'No se pudo eliminar el producto del carrito'
            })
        }
    }

    emptyCart = async (req, res) => {
        try {
            const { cartId } = req.params
            
            // Llamar al método emptyCart para vaciar el carrito
            const updatedCart = await cartService.emptyCart(cartId)
            
            res.status(200).json({
                status: 'success',
                message: 'Carrito vaciado exitosamente',
                payload: updatedCart
            })
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({
                status: 'error',
                message: 'No se pudo vaciar el carrito'
            })
        }
    }
}

export default CartController