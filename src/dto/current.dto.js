class CurrentUserDTO {
    constructor({ _id, role, first_name, cart, iat, exp }) {
      this.id = _id;
      this.role = role;
      this.first_name = first_name;
      this.cart = cart;
      this.iat = iat;
      this.exp = exp;
    }
}

export default CurrentUserDTO