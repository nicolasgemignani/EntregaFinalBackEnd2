import CurrentUserDTO from "../../dto/current.dto.js";
import { userService } from "../../service/index.service.js";
import { generateToken } from "../../utils/jwtToken.js";

class SessionController {
    constructor(){
        this.userService = userService
    }

    registro = async (req, res) => {
        const { first_name, last_name, email, password } = req.body
        if (!email || !password) {
            return res.status(400).send({ status: 'error', error: 'Ingrese email y password' })
        }
    
        const userFound = await userService.getUser({ email })
    
        if (userFound) {
            return res.status(401).send({ status: 'error', error: 'El usuario ya existe' })
        }
    
        const newUser = {
            first_name,
            last_name,
            email,
            password
        };
    
        const result = await userService.createUser(newUser)
        res.redirect('/login') // Mensaje de éxito
    }

    login = async (req, res) => {
        const { email, password } = req.body;
        
        try {
            const userFound = await userService.getUser({ email })
            if (!userFound) {
                return res.status(404).send({ status: 'error', error: 'No existe el usuario' })
            }
    
            const isMatch = await userFound.comparePassword(password)
            if (!isMatch) {
                return res.render('login', { error: 'Contraseña incorrecta' })
            }

            const cartId = userFound.cart
    
            const token = generateToken({ 
                id: userFound._id, 
                role: userFound.role, 
                first_name: userFound.first_name, 
                cart: cartId 
            })
    
            res.cookie('token', token, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true
            })
    
            return res.redirect('/products')
        } catch (error) {
            console.error(error); // Log para el seguimiento de errores
            res.render('login', { error: 'Error al iniciar sesión. Inténtalo de nuevo.' })
        }
    }

    logout = async (req, res) => {
        res.clearCookie('token'); // Limpia la cookie del token
        res.redirect('/login')
    }

    current = async (req, res) => {
        try {
            const userDTO = new CurrentUserDTO(req.user)
            console.log(req.user);
            res.send({ dataUser: userDTO, message: 'datos senscibles' })
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener la información del usuario' });
        }
        
    }
}

export default SessionController