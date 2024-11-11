import MongoSingleton from "../utils/mongo.singleton.js"

export default async () => {
    return await MongoSingleton.getInstance()
}