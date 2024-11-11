import { ticketService } from "../../service/index.service.js";

class TicketController {
    constructor() {
        this.ticketService = ticketService;
    }

    createTicket = async (req, res) => {
        try {
            const { amount, purchaser } = req.body;

            if (!amount || !purchaser) {
                return res.status(400).json({ error: 'Faltan campos obligatorios: amount y purchaser' });
            }

            const ticketData = { amount, purchaser };

            const newTicket = await this.ticketService.createTicket(ticketData);

            if (!newTicket) {
                return res.status(500).json({ error: 'No se pudo crear el ticket, intente nuevamente' });
            }

            res.status(201).json({
                message: 'Ticket creado con éxito',
                ticket: newTicket
            });
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            res.status(500).json({ error: 'Error al crear el ticket. Intente nuevamente más tarde.' });
        }
    }

    getTickets = async (req, res) => {
        try {
            const tickets = await this.ticketService.getTickets();

            if (!tickets || tickets.length === 0) {
                return res.status(404).json({ error: 'No se encontraron tickets' });
            }

            res.status(200).json({ tickets });
        } catch (error) {
            console.error('Error al obtener los tickets:', error);
            res.status(500).json({ error: 'Error al obtener los tickets. Intente nuevamente más tarde.' });
        }
    }

    getTicket = async (req, res) => {
        try {
            const { ticketId } = req.params;

            if (!ticketId) {
                return res.status(400).json({ error: 'El ID del ticket es necesario' });
            }

            const ticket = await this.ticketService.getTicket(ticketId);

            if (!ticket) {
                return res.status(404).json({ error: `Ticket con ID ${ticketId} no encontrado` });
            }

            res.status(200).json({ ticket });
        } catch (error) {
            console.error('Error al obtener el ticket:', error);
            res.status(500).json({ error: 'Error al obtener el ticket. Intente nuevamente más tarde.' });
        }
    }

    updateTicket = async (req, res) => {
        try {
            const { ticketId } = req.params;
            const updateData = req.body;

            if (!updateData || Object.keys(updateData).length === 0) {
                return res.status(400).json({ error: 'No se proporcionaron datos para actualizar el ticket' });
            }

            if (!ticketId) {
                return res.status(400).json({ error: 'El ID del ticket es necesario para actualizar' });
            }

            const updatedTicket = await this.ticketService.updateTicket(ticketId, updateData);

            if (!updatedTicket) {
                return res.status(404).json({ error: `Ticket con ID ${ticketId} no encontrado` });
            }

            res.status(200).json({
                message: 'Ticket actualizado con éxito',
                ticket: updatedTicket
            });
        } catch (error) {
            console.error('Error al actualizar el ticket:', error);
            res.status(500).json({ error: 'Error al actualizar el ticket. Intente nuevamente más tarde.' });
        }
    }

    deleteTicket = async (req, res) => {
        try {
            const { ticketId } = req.params;

            if (!ticketId) {
                return res.status(400).json({ error: 'El ID del ticket es necesario para eliminar' });
            }

            const deletedTicket = await this.ticketService.deleteTicket(ticketId);

            if (!deletedTicket) {
                return res.status(404).json({ error: `Ticket con ID ${ticketId} no encontrado` });
            }

            res.status(200).json({
                message: 'Ticket eliminado con éxito',
                ticket: deletedTicket
            });
        } catch (error) {
            console.error('Error al eliminar el ticket:', error);
            res.status(500).json({ error: 'Error al eliminar el ticket. Intente nuevamente más tarde.' });
        }
    }
}

export default TicketController;
