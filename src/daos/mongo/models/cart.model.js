// Importa el modulo mongoose para interactuar con MongoDB
import mongoose from "mongoose";

// Define el nombre de la coleccion para el modelo de carritos
const collectionName = 'carts'

// Define el esquema de la coleccion de carritos
const cartSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    // Campo 'products' que contiene una lista de productos en el carrito
    products:{
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId, // Referencia al ID del producto en la coleccion 'products'
                    ref: 'products' // Indica que el campo es una referencia a la operacion 'products'
                },
                quantity: {
                    type: Number, // Cantidad de productos en el carrito
                    required: true, // Es requerido
                    min: 1 // La cantidad minima es 1
                }
            }
        ],
        default: [] // Valor por defecto de un carrito vacio
    }
})

// Middleware pre-query para autopopular la referencia de productos
cartSchema.pre(/^find/, function(){
    // 'this' hace referencia a la consulta actual y se usa 'populate' para reemplazar la referencia del product
    this.populate('products.product')
})

// Crea el modelo de 'cart' basado en el esquema definido
const cartModel = mongoose.model(collectionName, cartSchema)

// Exporta el modelo de carrito para usarlo en otros modulos
export default cartModel