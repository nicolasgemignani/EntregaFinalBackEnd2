class ProductRepository {
    constructor(dao) {
        this.dao = dao;
    }

    // Método para crear un nuevo producto
    createProduct = async (productData) => await this.dao.create(productData);

    // Método para obtener todos los productos con paginación, filtrado y ordenamiento
    getAllProducts = async (options) => await this.dao.getAll(options);

    // Método para obtener un producto por su ID
    getProduct = async (productId) => await this.dao.getOne(productId);

    // Método para actualizar un producto
    updateProduct = async (productId, newData) => await this.dao.update(productId, newData);

    // Método para eliminar un producto
    deleteProduct = async (productId) => await this.dao.delete(productId);
}

export default ProductRepository;
