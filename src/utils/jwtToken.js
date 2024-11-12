import jwt from 'jsonwebtoken'
import { variables } from '../config/var.entorno.js'

export const generateToken = user => {
    try {
        // Desestructuración del objeto user
        const {  id, first_name, email, role, cart } = user;

        // Incluir todos los campos relevantes en el payload del token
        return jwt.sign(
            {  id , first_name, email, role, cart },  // Aquí incluyes el email
            variables.PRIVATE_KEY,
            { expiresIn: '1d' }
        );
    } catch (error) {
        console.error("Error generando el token:", error);
        throw new Error("Error generando el token");
    }
};
