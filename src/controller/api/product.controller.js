import { productService } from "../../service/index.service.js";

class ProductController {
    constructor(){
        this.productService = productService
    }

    createProduct = async (req, res) => {
        try {
            const newProduct = await productService.createProduct(req.body)
            res.status(201).json({ status: 'success', payload: newProduct })
        } catch (error) {
            console.error('Error creating product:', error)
            res.status(500).json({ status: 'error', message: 'Error creating product', error: error.message })
        }
    }

    getAllProducts = async (req, res) => {
        try {
            // Obtener parámetros de consulta
            const { limit = 5, page = 1, sort = '', query = '' } = req.query;
    
            // Convertir 'query' de cadena a objeto solo si no es vacío
            const queryObj = query ? JSON.parse(query) : {}
    
            // Configurar el ordenamiento
            const [sortField, sortOrder] = sort ? sort.split(':') : []
            const sortObj = sortField ? { [sortField]: parseInt(sortOrder, 10) || 1} : {price: 1}
    
            // Configurar el número de límite y página
            const limitNumber = parseInt(limit, 10)
            const pageNumber = parseInt(page, 10)
    
            // Configurar el objeto de búsqueda (query)
            const searchQuery = Object.keys(queryObj).length > 0 ? queryObj : {}
    
            // Obtener productos desde el servicio
            const listadoProducts = await productService.getAllProducts({
                limit: limitNumber,
                page: pageNumber,
                sort: sortObj,
                query: searchQuery
            })
    
            // Construir enlacees para la paginacion
            const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`
            const queryParams = new URLSearchParams(req.query)
    
            // Quitar el parámetro de página actual para construir prevLink y nextLink
            queryParams.delete('page')
    
            const prevLink = listadoProducts.hasPrevPage ? `${baseUrl}?${queryParams.toString()}&page=${listadoProducts.prevPage}` : null;
            const nextLink = listadoProducts.hasNextPage ? `${baseUrl}?${queryParams.toString()}&page=${listadoProducts.nextPage}` : null;
    
            // Enviar respuesta
            res.send({ 
                status: 'success', 
                payload: listadoProducts.docs,
                totalPages: listadoProducts.totalPages,
                prevPage: listadoProducts.prevPage,
                nextPage: listadoProducts.nextPage,
                page: listadoProducts.page,
                hasPrevPage: listadoProducts.hasPrevPage,
                hasNextPage: listadoProducts.hasNextPage,
                prevLink,
                nextLink
            })
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send({ status: 'error', message: 'Error fetching products' });
        }
    }

    getProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            const product = await productService.getProduct(productId)
            if (!product) {
                return res.status(404).json({ status: 'error', message: 'Product not found' })
            }
            res.status(200).json({ status: 'success', payload: product })
        } catch (error) {
            console.error('Error fetching product by ID:', error)
            res.status(500).json({ status: 'error', message: 'Error fetching product by ID', error: error.message })
        }
    }

    updateProduct = async (req, res) => {
        try {
            const productId = req.params.id
            const updatedProduct = await productService.updateProduct(productId, req.body)
            if (!updatedProduct) {
                return res.status(404).json({ message: 'Product not found' })
            }
            res.status(200).json({ status: 'success', payload: updatedProduct })
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error updating product', error: error.message })
        }
    }

    deleteProduct = async (req, res) => {
        try {
            const productId = req.params.id
            const deletedProduct = await productService.deleteProduct(productId)
            if (!deletedProduct) {
                return res.status(404).json({ status: 'error', message: 'Product not found' })
            }
            res.status(200).json({ status: 'success', message: 'Product deleted successfully' })
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error deleting product', error: error.message })
        }
    }
}

export default ProductController