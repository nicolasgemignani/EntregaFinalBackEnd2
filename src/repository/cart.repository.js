class CartRepository {
    constructor(dao) {
        this.dao = dao; // Asigna el DAO pasado como parámetro a la propiedad 'dao'
    }

    // Método para crear un nuevo carrito vacío
    createCart = async (userId) =>  await this.model.create({ user: userId, products: [] });
            
    // Método para obtener un carrito por su ID
    getCart = async (cartId) => await this.dao.getOne(cartId);

    // Método para eliminar un carrito por su ID
    deleteCart = async (cartId) => await this.dao.delete(cartId);

    // Método para agregar un producto al carrito
    addProductToCart = async (cartId, productId, quantityToAdd = 1) => {
        return await this.dao.addToCart(cartId, productId, quantityToAdd);
    };

    // Método para actualizar los productos de un carrito
    updateCart = async (cartId, newProducts) => 
        await this.dao.updateCart(cartId, newProducts);

    // Método para actualizar la cantidad de un producto en el carrito
    updateQuantity = async (cartId, productId, newQuantity) => 
        await this.dao.updateQuantity(cartId, productId, newQuantity);

    // Método para eliminar un producto del carrito
    removeFromCart = async (cartId, productId) => 
        await this.dao.removeFromCart(cartId, productId);

    // Método para vaciar todos los productos de un carrito
    emptyCart = async (cartId) => await this.dao.empty(cartId);
}

export default CartRepository;
