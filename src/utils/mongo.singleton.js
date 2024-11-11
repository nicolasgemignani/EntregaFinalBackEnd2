import { connect } from "mongoose";
import { variables } from "../config/var.entorno.js";

class MongoSingleton {
    static #instance;

    constructor() {
        if (!variables.MONGO_URL) {
            throw new Error("La variable de entorno MONGO_URL no está definida");
        }
        
        connect(variables.MONGO_URL, {})
            .then(() => console.log('Base de datos Conectada por singleton'))
            .catch((error) => console.error('Error al conectar a la base de datos:', error));
    }

    static getInstance() {
        if (this.#instance) {
            console.log('Base de datos ya conectada');
            return this.#instance;
        }
        this.#instance = new MongoSingleton();
        return this.#instance;
    }
}

export default MongoSingleton;
