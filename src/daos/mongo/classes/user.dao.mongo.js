import userModel from '../models/user.model.js'
import cartModel from '../models/cart.model.js'

class UserDaoMongo {
    constructor() {
        this.userModel = userModel;
        this.cartModel = cartModel
    }
    // Crear un nuevo usuario
    create = async (filter) => {
        // Crear el nuevo usuario
        const newUser = await this.userModel.create(filter);

        // Crear un nuevo carrito vinculado al usuario
        const newCart = await this.cartModel.create({ user: newUser._id, products: [] });

        // Actualizar el usuario con el ID del carrito
        newUser.cart = newCart._id;
        await newUser.save();

        return newUser;
    }     
    // Obtener todos los usuarios
    getAll = async () => await this.userModel.find()

    // Buscar un usuario por filtro
    getOne = async (filter) => await this.userModel.findOne(filter)
            
    // Actualizar un usuario por ID
    update = async (filter, updateData) => await this.userModel.findByIdAndUpdate(filter, updateData, { new: true });
            
    // Borrar un usuario por ID
    delete = async (filter) => await this.userModel.findByIdAndDelete(filter)
}

export default UserDaoMongo