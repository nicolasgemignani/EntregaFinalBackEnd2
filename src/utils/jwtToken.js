import jwt from 'jsonwebtoken'
import { variables } from '../config/var.entorno.js'

export const generateToken = user => {
    try {
        const { id, role, first_name, cart } = user;
        return jwt.sign({ id, role, first_name, cart }, variables.PRIVATE_KEY, { expiresIn: '1d' });
    } catch (error) {
        console.error("Error generando el token:", error);
        throw new Error("Error generando el token"); // Lanza un error para manejarlo donde se llame a esta función
    }
};
