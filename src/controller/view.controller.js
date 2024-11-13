import { productService } from "../service/index.service.js";
import { cartService } from "../service/index.service.js";
import { ticketService } from "../service/index.service.js";
import { sendEmail } from "../utils/sendEmail.js";
import mongoose from "mongoose";


class ViewController {
    constructor(){
        this.productService = productService
        this.cartService = cartService
        this.ticketService = ticketService
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
            const cart = await cartService.getCart(req.params.id);
            
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' });
            }
    
            // Mapea los productos y ajusta la estructura
            const cartItems = Array.isArray(cart.products) ? await Promise.all(cart.products.map(async (item) => {
                const product = await productService.getProduct(item.product);
                
                if (!product) {
                    return null;
                }
    
                const totalPrice = item.quantity * product.price;
    
                return {
                    quantity: item._doc.quantity,  // Asegura que quantity esté en el nivel superior
                    product,  // Incluye los datos del producto completo
                    totalPrice
                };
            })) : [];
    
            const filteredCartItems = cartItems.filter(item => item !== null);

            // Calcular el total del carrito sumando el totalPrice de cada item
            const cartTotalPrice = parseFloat(filteredCartItems.reduce((acc, item) => acc + item.totalPrice, 0).toFixed(2));
    
            res.render('carrito', { cart: filteredCartItems, totalPrice: cartTotalPrice, cartId: cart._id });
        } catch (error) {
            res.status(500).json({ status: 'error', message: 'Error al obtener el carrito', error: error.message });
        }
    };
    

    createTicket = async (req, res) => {
        try {
            const userId = req.user.cart;
            const cart = await this.cartService.getCart(userId);
    
            if (!cart || cart.products.length === 0) {
                return res.status(400).json({ error: 'El carrito está vacío o no existe' });
            }
    
            const productosNoComprados = [];
            const productosComprados = [];
    
            // Procesar cada producto en el carrito
            for (let item of cart.products) {
                const producto = item.product;
                const cantidadSolicitada = item.quantity;
    
                // Verificar si hay suficiente stock o ajustar a la cantidad disponible
                if (producto.stock >= cantidadSolicitada) {
                    producto.stock -= cantidadSolicitada;
                    await producto.save();
                    productosComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidad: cantidadSolicitada,
                        precio: producto.price
                    });
                } else if (producto.stock > 0) {
                    // Comprar la cantidad que haya en stock si no alcanza para el total solicitado
                    productosComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidad: producto.stock,
                        precio: producto.price
                    });
                    productosNoComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidadFaltante: cantidadSolicitada - producto.stock
                    });
                    // Actualizar la cantidad restante en el carrito
                    item.quantity = cantidadSolicitada - producto.stock;
                    producto.stock = 0;
                    await producto.save();
                } else {
                    // Si no hay stock disponible en absoluto
                    productosNoComprados.push({
                        nombre: producto.title,
                        producto: producto._id,
                        cantidadFaltante: cantidadSolicitada
                    });
                }
            }
    
            // Calcular el monto total solo de los productos comprados
            const totalAmount = productosComprados.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    
            let newTicket = null;
            if (productosComprados.length > 0) {
                const ticketData = {
                    amount: totalAmount,
                    purchaser: req.user.email,
                    products: productosComprados
                };
    
                // Crear el ticket para los productos comprados
                newTicket = await this.ticketService.createTicket(ticketData);
                if (!newTicket) {
                    return res.status(500).json({ error: 'No se pudo crear el ticket, intente nuevamente' });
                }
            }
    
            // Actualizar el carrito para que solo contenga productos no comprados o incompletos
            cart.products = cart.products.filter(item => productosNoComprados.some(p => p.producto.equals(item.product._id)));
            await cart.save();
    
            // Responder con el ticket y la lista de productos que no pudieron comprarse en su totalidad
            if (newTicket) {
                await sendEmail(req.user.email, newTicket, productosNoComprados, productosComprados);
                res.status(201).render('ticket', {
                    message: 'Compra procesada',
                    ticket: {
                        code: newTicket.code,
                        amount: newTicket.amount,
                        purchaser: newTicket.purchaser,
                        products: productosComprados
                    },
                    productosNoComprados
                });
            } else {
                res.status(400).json({ error: 'No se pudieron comprar productos debido a falta de stock' });
            }
    
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            res.status(500).json({ error: 'Error al crear el ticket. Intente nuevamente más tarde.' });
        }
    };
    
    
    
    emptyCart = async (req, res) => {
        try {
            const cartId = req.params.id;
            
            // Vaciar el carrito utilizando el servicio
            await this.cartService.emptyCart(cartId);

            // Redirigir a la vista del carrito con el id correspondiente
            res.redirect(`/carrito/${cartId}`);
        } catch (error) {
            console.error('Error al vaciar el carrito:', error);
            res.status(500).json({ error: 'No se pudo vaciar el carrito, intente nuevamente' });
        }
    };
    
    
    ticketSucess = (req, res) => {
        res.render('ticket_success', { message: '¡Compra realizada con éxito! Gracias por su compra.' });
    }
}

export default ViewController