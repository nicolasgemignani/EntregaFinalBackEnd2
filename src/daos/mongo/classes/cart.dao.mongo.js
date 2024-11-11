// Importa los modelos de mongoose para el manejo de carritos y productos
import cartModel from '../models/cart.model.js';

// Clase para gestionar las operaciones de carritos utilizando MongoDB a traves de Mongoose
class CartDaoMongo {
    constructor() {
        this.model = cartModel; // Define el modelo de carrito
    }


    create = async (userId) => await this.model.create({ user: userId, products: [] });

    // Metodo para obtener un carrito por su ID
    getOne = async (filter) => await this.model.findById(filter);
            
    // Metodo para eliminar un carrito por su ID
    delete = async (filter) => await this.model.deleteOne({ _id: filter });

    // Metodo para agregar un producto al carrito
    addToCart = async (cartId, productId, quantityToAdd = 1) => {
        
        // Busca el carrito por ID
        const cart = await this.model.findById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }

        // Intenta actualizar la cantidad del producto en el carrito
        const updateResult = await this.model.updateOne(
            { 
                _id: cartId, 'products.product': productId 
            },
            {
                $inc: { 'products.$.quantity': quantityToAdd }
            }
        );

        // Si no se actualizó, significa que el producto no estaba en el carrito
        if (updateResult.modifiedCount === 0) {
            // Agrega el nuevo producto al carrito
            cart.products.push({ product: productId, quantity: quantityToAdd });
            await cart.save(); // Guarda el carrito actualizado
        }

        return cart; // Devuelve el carrito actualizado
    };
    
    // Metodo para actualizar los productos de un carrito
    updateCart = async (filter, newData) => {
        const cart = await this.model.findById(filter);
        const newDataMap = Object.fromEntries(newData.map(({ product, quantity }) => [product.toString(), quantity]));
    
        cart.products = [
            ...cart.products
                .filter(p => newDataMap[p.product.toString()])
                .map(p => ({ product: p.product, quantity: newDataMap[p.product.toString()] })),
            ...newData.filter(({ product }) => !cart.products.some(p => p.product.toString() === product.toString())),
        ];

        return await cart.save(); // Guarda y devuelve el carrito actualizado
    };
    
    // Metodo para actualizar la cantidad de un producto en el carrito
    updateQuantity = async (cartId, productId, newQuantity) => await this.model.findByIdAndUpdate(
        cartId,
        { $set: { 'products.$[elem].quantity': newQuantity } },
        { arrayFilters: [{ 'elem.product': productId }], new: true }
    );

    // Metodo para eliminar un producto del carrito
    removeFromCart = async (cartId, productId) => 
        await this.model.findByIdAndUpdate(cartId, { $pull: { products: { product: productId } } }, { new: true });

    // Metodo para vaciar todos los productos de un carrito
    empty = async (filter) => await this.model.findByIdAndUpdate(filter, { products: [] });

    
}

export default CartDaoMongo;
