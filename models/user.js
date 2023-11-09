const Model = require('./model')
const userValidator = require('./../validators/userValidator')

class User extends Model{
    static name = "User"
    static validator = userValidator

    constructor (data = null) {
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