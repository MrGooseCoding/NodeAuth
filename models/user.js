const Model = require('./model')
const userValidator = require('./../validators/userValidator')
const bcrypt = require('bcrypt');

class User extends Model{
    static name = "User"
    static validator = userValidator
    static table = "users"

    constructor (data = {}) {
        super(data)
    }

    static async objects_getBy (attrName, attrValue, removePassword=true) {
        const data = await this.__objects_getBy(attrName, attrValue);
        if (removePassword && data[0]) {
            delete data[1]["password"]; // It is write-only
        }
        return data;
    }

    static async objects_searchBy (attrName, attrValue, limit, removePassword=true) {
        const data = await this.__objects_searchBy(attrName, attrValue, limit)
        
        if (removePassword) {
            data.map((v) => {
                delete v["password"]
            })
        }

        return data
    }

    static async authenticate (username, password) {
        const userData = await this.objects_getBy("username", username, false)
        const match = await bcrypt.compare(password, userData[1].password);
        delete userData[1].password
        return [match, userData[1]]
    }

    async change (attrName, attrValue, removePassword=true) {
        var data = await this.__change(User.table, attrName, attrValue)
        
        if (removePassword) {
            delete data["password"]; // It is write-only
        }
        return data
    }
}

module.exports = User