import { createTransport } from 'nodemailer';
import { variables } from '../config/var.entorno.js';

const transport = createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: variables.GMAIL_USER,
        pass: variables.GMAIL_PASS
    }
});

export const sendEmail = async (email, ticket, productosNoComprados, productosComprados) => {
    const productosCompradosHtml = productosComprados.map(item => 
        `<li>
            <strong>Producto:</strong> ${item.nombre} - 
            <strong>Cantidad:</strong> ${item.cantidad} - 
            <strong>Precio unitario:</strong> $${item.precio}
        </li>`
    ).join('');

    const productosNoCompradosHtml = (productosNoComprados || []).map(item => 
        `<li>
            <strong>Producto:</strong> ${item.nombre} - 
            <strong>Cantidad Faltante:</strong> ${item.cantidadFaltante}
        </li>`
    ).join('');

    await transport.sendMail({
        from: `Coder test <${variables.GMAIL_USER}>`,
        to: email,
        subject: 'Ticket de Compra',
        html: `
            <div>
                <h1>Ticket de Compra</h1>
                <p><strong>Código del Ticket:</strong> ${ticket.code}</p>
                <p><strong>Comprador:</strong> ${ticket.purchaser}</p>
                <p><strong>Total:</strong> $${ticket.amount}</p>

                <h2>Productos Comprados:</h2>
                <ul>${productosCompradosHtml}</ul>

                ${productosNoComprados.length ? `
                    <h2>Productos No Comprados (stock insuficiente):</h2>
                    <ul>${productosNoCompradosHtml}</ul>
                ` : ''}

                <p>Gracias por su compra.</p>
            </div>
        `
    });
};