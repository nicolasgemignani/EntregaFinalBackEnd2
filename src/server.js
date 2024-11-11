import express from 'express'
import handlebars from 'express-handlebars'
import cookieParser from 'cookie-parser'
import passport from 'passport'

import { initializePassport } from './config/passportConfig.js'
import connectDB from './config/connect.config.js'
import appRouter from './router/index.router.js'
import viewsRouter from './router/view.router.js'
import { variables } from './config/var.entorno.js'

// Importa modulos para trabajar con URLs y rutas de archivos
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


// Convierte la URL del módulo actual en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
// Obtiene el nombre del directorio actual a partir de la ruta de archivo
const __dirname = dirname(__filename);


const app = express()
const PORT = variables.port

// Middleware para procesar cuerpos de las solicitudes en formato JSON y URL-encoded
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Configuracion de  archivops estaticos (archivos de la carpeta 'public')
app.use(express.static(join(__dirname, 'public')))

// Configuracion de la vista con Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', join(__dirname, '/views'))
app.set('view engine', 'handlebars')

app.use(cookieParser(variables.COOKIEPARSE))

initializePassport()
app.use(passport.initialize())

// Configuracion de las rutas
app.use(appRouter)
app.use(viewsRouter)

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
}).on('error', err => {
    console.error('Error al iniciar el servidor:', err)
});

// Conecta a la base de datos y menaja errores
connectDB()