import mongoose from "mongoose";

const collectionName = 'ticket'

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true,
        required: true,
        default: function () {
            // Generar un código único (puedes adaptarlo según tu preferencia)
            return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        }
    },
    purchase_datetime: {
        type: Date,
        default: Date.now // Almacena la fecha y hora actual en la que se crea el Ticket
    },
    amount: {
        type: Number,
        required: true // Total de la compra
    },
    purchaser: {
        type: String, // Cambiado de ObjectId a String para almacenar el email
        required: true
    }
});

const ticketModel = mongoose.model(collectionName, ticketSchema)

export default ticketModel