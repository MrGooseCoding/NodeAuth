const database = require('./../database/database')

class Model {
    constructor (table, data) {
        this.table = table
        this.data = data
    }

    static __objects_getBy(attrName, attrValue) {
        const db = database.open()
        const identifierAttr = {}
        identifierAttr[attrName] = attrValue
        return database.get(db, 'users', identifierAttr)
            .then(data => {
                if (!data) {
                    return [false, {error: `${this.name} does not exist`}]
                }
                return [true, data]
            })
    }

    static __objects_filterBy(attrName, attrValue, limit) {
        const db = database.open()

        const identifierAttr = {}
        identifierAttr[attrName] = attrValue
        return database.query(db, this.table, identifierAttr, limit)
    }

    __change (attrName, attrValue) {
        const db = database.open()
        this.data[attrName] = attrValue

        const identifierAttr = {}
        identifierAttr["id"] = this.data.id

        return database.write(db, this.table, this.data, identifierAttr)
    }
    setData (data) {
        this.data = data
    }
}

module.exports = Model