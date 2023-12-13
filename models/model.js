const database = require('./../database/database')

class Model {
    constructor (data) {
        this.data = data
    }

    static async __objects_getBy(attrName, attrValue) {
        const db = database.open()
        const identifierAttr = {}
        identifierAttr[attrName] = attrValue
        const data = await database.get(db, 'users', identifierAttr)
        if (!data) {
            return [false, { error: `${this.name} does not exist` }]
        }
        return [true, data]
    }

    static __objects_filterBy(attrName, attrValue, limit) {
        const db = database.open()

        const identifierAttr = {}
        identifierAttr[attrName] = attrValue
        return database.query(db, this.table, identifierAttr, limit)
    }

    async __change (attrName, attrValue) {
        const db = database.open()
        this.data[attrName] = attrValue

        const identifierAttr = {}
        identifierAttr["id"] = this.data.id

        const data = await database.write(db, this.table, this.data, identifierAttr)
        return data
    }
    
    setData (data) {
        this.data = data
    }
}

module.exports = Model