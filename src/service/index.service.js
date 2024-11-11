import UserDaoMongo     from "../daos/mongo/classes/user.dao.mongo.js";
import ProductDaoMongo  from "../daos/mongo/classes/product.dao.mongo.js";
import CartDaoMongo     from "../daos/mongo/classes/cart.dao.mongo.js";
import TicketDaoMongo   from "../daos/mongo/classes/ticket.dao.mongo.js";

import UserRepository    from "../repository/user.repository.js";
import ProductRepository from "../repository/product.repository.js";
import CartRepository    from "../repository/cart.repository.js";
import TicketRepository  from "../repository/ticket.repository.js";

export const userService    = new UserRepository(new UserDaoMongo)
export const productService = new ProductRepository(new ProductDaoMongo)
export const cartService    = new CartRepository(new CartDaoMongo)
export const ticketService  = new TicketRepository(new TicketDaoMongo)