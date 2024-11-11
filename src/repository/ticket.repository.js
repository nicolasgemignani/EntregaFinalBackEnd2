class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    createTicket = async(userData) => await this.dao.create(userData)

    getTickets = async () => await this.dao.getAll() 

    getTicket = async (ticketId) => await this.dao.getOne(ticketId)

    updateTicket = async (ticketId, updateData) => await this.dao.update(ticketId, updateData)

    deleteTicket = async(ticketId) => await this.dao.deleteBy(ticketId)
}

export default TicketRepository