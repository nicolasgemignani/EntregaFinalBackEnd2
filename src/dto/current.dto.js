class CurrentUserDTO {
    constructor({ _id, role, first_name, last_name, cart, email, iat, exp }) {
      this.id = _id;
      this.role = role;
      this.first_name = first_name;
      this.last_name = last_name
      this.cart = cart;
      this.email = email;
      this.iat = iat;
      this.exp = exp;
    }
}

export default CurrentUserDTO