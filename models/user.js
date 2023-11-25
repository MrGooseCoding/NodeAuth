const Model = require('./model')
const userValidator = require('./../validators/userValidator')
const bcrypt = require('bcrypt');

class User extends Model{
    static name = "User"
    static validator = userValidator

    constructor (data = {}) {
        super('users', data)
    }

    static objects_getBy (attrName, attrValue, removePassword=true) {
        return this.__objects_getBy(attrName, attrValue).then((data)=> {
            if (removePassword  || data[0]) {
                delete data[1]["password"] // It is write-only
            }
            return data
        })
    }

    static objects_filterBy (attrName, attrValue, limit, removePassword=true) {
        return this.__objects_filterBy(attrName, attrValue, limit).then((data) => {
            if (removePassword) {
                data.map((v) => {
                    delete v["password"]
                })
            }
            return data
        })
    }

    static async authenticate (username, password) {
        const userData = await this.__objects_getBy("username", username)
        const match = await bcrypt.compare(password, userData[1].password);
        delete userData.password
        return [match, userData[1]]
    }

    change (attrName, attrValue, removePassword=true) {
        return this.__change(attrName, attrValue).then((data) => {
            if (removePassword) {
                delete data["password"] // It is write-only
            }
            return data
        })
    }
}

module.exports = User