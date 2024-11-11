import UserDto from "../dto/user.dto.js"

class UserRepository {
    constructor(dao){
        this.dao = dao
    }
    createUser = async (userData) => await this.dao.create(userData)

    getAllUsers = async () => {
        const users = await this.dao.getAll({})
        return users.map(user => new UserDto(user))
    }
    getUser = async (userId) => await this.dao.getOne(userId)

    updateUser = async (userId, updateData) => await this.dao.update(userId, updateData)

    deleteUser = async (userId) => await this.dao.delete(userId)
}

export default UserRepository