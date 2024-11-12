

URLs de prueba para facilitar la correcion:(debera cambiar los id ya que se generan por MongoDB)


--------------------PAGINA PRINCIPAL

URL: http://localhost:8080/products


PAGINA DE LOS PRODUCTOS EN LA BASE DE DATOS

URL: http://localhost:8080/api/products


----------------------LOGIN


URL: http://localhost:8080/login
email ADMIN: nicolasgemignani@outlook.com
email USER: sofiaG@outlook.com
passwords: 123456


----------------------PRODUCTOS

AGREGAR UN PRODUCTO

METODO: POST

URL: http://localhost:8080/api/products

Body:

{
    "title": "Laptop ABC",
    "description": "Una laptop con procesador Intel i7, 16 GB de RAM y 512 GB SSD.",
    "code": "LT456",
    "price": 899.99,
    "status": true,
    "stock": 30,
    "category": "Computers",
    "thumbnail": "https://example.com/images/lt456.jpg"
}


BUSCAR UN PRODUCTO

METODO: GET

URL: http://localhost:8080/api/products/(ID DEL PRODUCTO)


ACTUALIZAR UN PRODUCTO

METODO: PUT

URL: http://localhost:8080/api/products/(ID DEL PRODUCTO)

BODY:

{
    "title": "Digital camera"
}


BORRAR UN PRODUCTO

METODO: DELETE

URL: http://localhost:8080/api/products/(ID DEL PRODCUCTO)


BUSQUEDAS AVANZADAS

METODO: GET

LIMIT Y PAGE

URL: http://localhost:8080/api/products?limit=5&page=1


LIMIT, PAGE Y SORT

URL: http://localhost:8080/api/products?limit=5&page=1&sort=price:1


LIMIT, PAGE, QUERY

URL: http://localhost:8080/api/products?limit=5&page=1&query={"category":"Electronics"}



----------------------- CARTS


CREAR UN CARRITO

METODO: POST

URL: http://localhost:8080/api/carts/


AGREGAR UN PRODUCTO AL CARRITO

METODO: POST

URL: http://localhost:8080/api/carts/(ID DEL CARRITO)/products/(ID DEL PRODUCTO)

BODY:

{
    "quantityToAdd": 10
}


VER CARRITO

METODO: GET

URL: http://localhost:8080/api/carts/(ID DEL CARRITO)


ACTUALIZAR LOS PRODUCTOS DE UN CARRITO

METODO: PUT

URL: http://localhost:8080/api/carts/(ID DEL CARRITO)

BODY:

[
    {
        "product": "(ID DEL PRODUCTO)",
        "quantity": 5
    },
    {
        "product": "(ID DEL PRODUCTO)",
        "quantity": 5
    }
]


ACTUALIZAR SOLO QUANTITY DE LOS CARRITOS

MEDOTO: PUT

URL: http://localhost:8080/api/carts/(ID DEL CARRITO)/product/(ID DEL PRODUCTO)

BODY:

{
    "quantity": 150
}


BORRAR UN PRODUCTO

METODO: DELETE

URL: http://localhost:8080/api/carts/(ID DEL CARRITO)/products/(ID DEL PRODUCTO)


VACIAR UN CARRITO

METODO: DELETE

URL: http://localhost:8080/api/carts/(ID DEL CARRITO)


BORRAR UN CARRITO

METODO: DELETE

URL: http://localhost:8080/api/carts/remove/(ID DEL CARRITO)
