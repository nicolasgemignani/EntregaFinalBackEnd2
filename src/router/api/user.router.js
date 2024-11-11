import { Router } from 'express';

import UserController from '../../controller/api/user.controller.js';
import { passportCall } from '../../midllewares/passportMiddle.js';
import { authorization } from '../../midllewares/authorization.js';

const router = Router()
const userController = new UserController();

// Crear un nuevo usuario
router.post('/', passportCall('jwt', { session: false }), authorization('admin'), userController.createUser);

// Obtener todos los usuarios
router.get('/', passportCall('jwt', { session: false }), authorization('admin'), userController.getAllUser);

// Obtener un usuario por ID
router.get('/:id', passportCall('jwt', { session: false }), authorization('admin'), userController.getUser);

// Actualizar usuario
router.put('/:id', passportCall('jwt', { session: false }), authorization('admin'), userController.updateUser);

// Eliminar usuario
router.delete('/:id', passportCall('jwt', { session: false }), authorization('admin'), userController.deleteUser);

export default router;
