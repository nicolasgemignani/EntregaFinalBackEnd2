import ticketModel from "../models/ticket.model.js";

class TicketDaoMongo {
    constructor(){
        this.ticketModel = ticketModel
    }
    create      = async (filter) => await this.ticketModel.create(filter)
    getAll      = async () => await this.ticketModel.find()
    getOne      = async (filter) => await this.ticketModel.findOne(filter)
    update      = async (filter, updateData) => await this.ticketModel.findByIdAndUpdate(filter, updateData)
    deleteBy    = async (filter) => await this.ticketModel.findByIdAndDelete(filter)
}        

export default TicketDaoMongo