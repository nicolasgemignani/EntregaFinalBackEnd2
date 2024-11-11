// Importa el modelo de productos desde la carpeta de modelos
import productModel from "../models/product.model.js"

// Clase para manejar las operaciones relacionadas con productos usando MongoDB a travez de Mongoose
class ProductDaoMongo {
    constructor(){
        this.model = productModel // Asigna el modelo de productos al atributo 'model' de la clase
    }
    // Metodo para crear un nuevo producto
    create = async (filter) => await this.model.create(filter)

    // Metodo para obtener una lista de productos con paginacion, filtrado y ordenamiento
    getAll = async ({ limit = 10, page = 1, sort = { price: 1 }, query = {} }) => {
        const options = {
            limit,
            page,
            sort,
            lean: true // Devuelve objetos de JavaScript en lugar de documentos Mongoose
        };
        return await productModel.paginate(query, options)
    }
     
    // Metodo para obtener un producto por su ID
    getOne = async (filter) => await this.model.findById(filter).lean()
            
    // Metodo para actualizar un producto existente por su ID
    update = async (filter, newData) => await this.model.findByIdAndUpdate(filter, newData, { new: true, lean: true })
            
    // Metodo para eleminar un producto por su ID
    delete = async (filter) => await this.model.findByIdAndDelete(filter)  
}

export default ProductDaoMongo