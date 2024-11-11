import multer from "multer";
import { dirname } from 'path'
import { fileURLToPath } from 'url'

// Obtener el nombre del archivo actual y el directorio
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuracion del almacenamiento para multer
const storage = multer.diskStorage({
    // Determinar el directorio de destino para los archivos cargados
    destination: function(req, file, cb) {
        // Guardar los archivos en el directorio 'public/uploads'
        cb(null, `${__dirname}/../public/uploads`)
    },
    // Determinar el nombre del archivo cargado
    filename: function(req, file, cb) {
        // Usar la fecha actual en milisegundos como prefijo para evitar colisiones de nombres
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

// Crear una instancia de multer con la configuracion de almacenamiento
const uploader = multer({
    storage
})

export default uploader