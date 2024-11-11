// Importa mongoose para interactuar con MongoDB y el plugin de paginacion de mongoose
import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

// Define el esquema de la coleccion de productos
const collectionName = 'products'

// Define el esquema de la coleccion de productos
const productSchema = new mongoose.Schema ({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true
    },
    price:{
        type: Number,
        required: true,
        min: 0
    },
    status:{
        type: Boolean,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    thumbnail:{
        type: String,
        required: true
    }
})

// A;ade el plugin de paginacion al esquema de productos
productSchema.plugin(mongoosePaginate)

// Crea el modelo de 'product' basado en el esquema definido
const productModel = mongoose.model(collectionName, productSchema)

export default productModel