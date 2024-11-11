import { userService } from "../../service/index.service.js";

class UserController {
    constructor(){
        this.userService = userService
    }

    createUser = async (req,res) => {
        try {
            const newUser = await userService.createUser(req.body)
            res.json({ status: 'success', payload: newUser })
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al crear usuario', error: error.message });
        }
    }

    getAllUser = async (req, res) => {
        try {
            const listUsers = await userService.getAllUsers();
            res.json({ status: 'success', payload: listUsers });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al obtener usuarios', error: error.message })
        }
    }

    getUser = async (req, res) => {
        try {
            const user = await userService.getUser(req.params.id)
            if (!user) {
                return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' })
            }
            res.json({ status: 'success', payload: user })
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al obtener el usuario', error: error.message })
        }
    }

    updateUser = async (req, res) => {
        try {
            const updatedUser = await userService.updateUser(req.params.id, req.body);
            res.json({ status: 'success', payload: updatedUser })
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al actualizar usuario', error: error.message })
        }
    }

    deleteUser = async (req, res) => {
        try {
            await userService.deleteUser(req.params.id)
            res.json({ status: 'success', message: 'Usuario eliminado' })
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al eliminar usuario', error: error.message })
        }
    }
}

export default UserController