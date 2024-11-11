import { productService } from "../service/index.service.js";
import { cartService } from "../service/index.service.js";
import mongoose from "mongoose";


class ViewController {
    constructor(){
        this.productService = productService
        this.cartService = cartService
    }

    registro = (req, res) => {
        res.render('register', {})
    }

    login = (req, res) => {
        res.render('login', {})
    }

    paginateProducts = async (req, res) => {
        try {
            const listadoProducts = await productService.getAllProducts(req.query);
    
            // Elimina _id y retorna el resto de las propiedades
            const productsResultadoFinal = listadoProducts.docs.map(({ _id, ...rest }) => ({ _id, ...rest }));
    
            // Renderiza la vista con los productos y la información de paginación
            res.render('products', {
                products: productsResultadoFinal,
                hasPrevPage: listadoProducts.hasPrevPage,
                hasNextPage: listadoProducts.hasNextPage,
                prevPage: listadoProducts.prevPage,
                nextPage: listadoProducts.nextPage,
                currentPage: listadoProducts.page,
                totalPages: listadoProducts.totalPages,
                user: req.user // Pasa el objeto user a la vista
            });
    
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('Error fetching products'); // Considera un mensaje de error más descriptivo
        }
    }
    

    addToCart = async (req, res) => {
        const { productId } = req.params;
        let { quantity } = req.body;

        try {
            // Validar que el ID del producto sea un ID de MongoDB válido
            if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
                return res.status(400).json({ error: 'ID del producto no válido' });
            }
    
            // Convertir la cantidad a un número entero y validar que sea positiva
            quantity = parseInt(quantity, 10);
            if (isNaN(quantity) || quantity <= 0) {
                return res.status(400).json({ error: 'Cantidad no válida' });
            }
    
            // Obtener el ID del carrito del usuario desde el token JWT
            const cartId = req.user.cart; // Asegúrate de que esto sea correcto

            // Verifica que el cartId esté definido
            if (!cartId) {
                return res.status(400).json({ error: 'El ID del carrito no está definido' });
            }
    
            // Agregar el producto al carrito existente
            const updatedCart = await cartService.addProductToCart(cartId, productId, quantity);
            return res.redirect('/products');
    
        } catch (error) {
            console.error('Error:', error);
            // Manejar el error específico de carrito no encontrado
            if (error.message === 'Carrito no encontrado') {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
            res.status(500).json({ error: 'No se pudo agregar el producto al carrito' });
        }
    };

    addProduct = async (req, res) => {
        try {
            const { title, description, code, price, status, stock, category } = req.body;
            const thumbnail = req.file ? req.file.path : ''; // Obtener la ruta de la imagen subida
    
            const newProduct = await productService.createProduct({
                title,
                description,
                code,
                price,
                status: status === 'true', // Convierte el valor a booleano
                stock,
                category,
                thumbnail
            });
    
            await newProduct.save();
            res.redirect('/products'); // Redirigir a la lista de productos después de guardar
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al agregar el producto');
        }
    }

    form = async (req, res) => {
        res.render('productForm', {})
    }

    updateProduct = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, code, price, status, stock, category } = req.body;
            const thumbnail = req.file ? req.file.path : ''; // Obtener la ruta de la imagen subida
            
            // Actualizar el producto
            await productService.updateProduct(id, {
                title,
                description,
                code,
                price,
                status: status === 'true',
                stock,
                category,
                thumbnail
            });

            res.redirect('/products'); // Redirigir a la lista de productos después de actualizar
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al actualizar el producto');
        }
    }

    productId = async (req, res) => {
        try {
            const product = await productService.getProduct(req.params.id);
            if (!product) {
                return res.status(404).send("Producto no encontrado.");
            }
            res.render('updateProduct', { product });
        } catch (error) {
            console.error("Error al cargar el producto para edición:", error);
            res.status(500).send("Hubo un error al cargar el producto.");
        }
    }

    deleteProduct = async (req, res) => {
        try {
            await productService.deleteProduct(req.params.id);
            res.redirect('/products'); // Redirige a la lista de productos tras eliminar
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            res.status(500).send("Hubo un error al eliminar el producto.");
        }
    }

    getCart = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
    
        try {
            // Obtén el carrito real desde la base de datos
            const cart = await cartService.getCart(req.params.id);
            
            // Si no se encuentra el carrito, devuelve un error
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            // Verificar que cart.products existe y es un array antes de llamar a map
            const cartItems = Array.isArray(cart.products) ? cart.products.map(item => {
                // Llamar al servicio para obtener el producto real usando el ID de 'item.product'
                // Este paso depende de cómo estés obteniendo el producto, por ejemplo:
                const totalPrice = item.quantity * 100;  // Si tienes un precio estático, de lo contrario obtén el precio del producto
                return {
                    ...item,
                    totalPrice
                };
            }) : [];
    
            // Pasar el carrito y los productos con su total a la plantilla
            res.render('carrito', { cart: cartItems });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al obtener el carrito', error: error.message });
        }
    };
    
    
    
}

export default ViewController