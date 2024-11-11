// Se ejecuta cuando el DOM ha sido completamente cargado y analizado
document.addEventListener('DOMContentLoaded', () => {

    // Funcion para menejar errores, que muestra un mensaje en la consola para depuracion
    const handleError = (error) => {
        console.error('Error:', error)
        alert('Error al agregar el producto al carrito')
    };

    // Expuesta globalmente para que pueda ser llamada desde el HTML
    window.agregarAlCarrito = async (productId) => {

        // Verifica si el ID del producto es valido
        if (!productId) {
            alert('ID del producto no válido')
            return;
        }

        try {
            // Realiza una solicitud POST al servidor para agregar el producto al carrito
            const response = await fetch(`/cart/add/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: 1 }) // Ajusta la cantidad si es necesario
            });

            // Verifica si la respuesta del servidor es existosa
            if (response.ok) {
                const data = await response.json()
                alert('Producto agregado al carrito')
                // Opcional: Actualiza la interfaz de usuario o realiza otras acciones
            } else {
                // Maneja errores del servidor, muestra un mensaje especifico
                const errorData = await response.json()
                alert(`Error al agregar el producto al carrito: ${errorData.error || 'Error desconocido'}`)
            }
        } catch (error) {
            // Llama a la funcion de manejo de errores en caso de exepciones
            handleError(error)
        }
    }
})