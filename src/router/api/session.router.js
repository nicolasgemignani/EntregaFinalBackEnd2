import { Router } from "express";
import passport from "passport";

import SessionController from "../../controller/api/session.controller.js";

import { passportCall } from "../../midllewares/passportMiddle.js";
import { authorization } from "../../midllewares/authorization.js";

const router = Router()
const sessionController = new SessionController()

router.get('/github', passport.authenticate('github', { scope: ['user: email']}), async (req, res) => {

})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login' }), async (req, res) => {
    req.session.user = req.user
    res.redirect('/login')
})

router.get('/failregister', async (req, res) => {
    console.log('Falló el registro');
    res.status(400).send({ status: 'error', error: 'fallo el registro' });
});

router.get('/faillogin', async (req, res) => {
    console.log('Fallo la estrategia');
    res.send({status: 'error', error: 'fallo el login'})
})

// Ruta para crear un nuevo usuario
router.post('/register', sessionController.registro);

// Ruta para Loguear 
router.post('/login', sessionController.login);

// Ruta para cerrar sesion
router.post('/logout', passportCall('jwt', { session: false }), sessionController.logout);

// Ruta current Prueba de autenticidad
router.get('/current', passportCall('jwt', {session: false}), authorization('admin'), sessionController.current)

export default router