class UserDto{
    constructor({ _id, first_name, last_name, email, role, cart, createdAt, updatedAt }) {
        this._id = _id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.role = role;
        this.cart = cart;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export default UserDto