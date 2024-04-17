const database = require('./../database/database')

class Model {
    constructor (data, table) {
        this.data = data
        this.table = table
    }

    static async _create (data) {
        const db = database.open()

        await database.insert(db, this.table, data).then(data => data)
        return new this(data)
    }

    static async get_data_types() {
        const db = database.open()
        return await database.getDataTypes(db, this.table)
    }

    static async objects_deleteBy(attrName, attrValue) {
        const db = database.open()

        const identifierAttr = {}
        identifierAttr[attrName] = attrValue

        await database.deleteItem(db, this.table, identifierAttr)

    }

    static async objects_getBy(attrName, attrValue) {
        const db = database.open()

        const identifierAttr = {}
        identifierAttr[attrName] = attrValue

        const data = await database.get(db, 'users', identifierAttr)

        return data[0] ? new this(data[0]) : { error: `${this.name} does not exist` }
    }

    static async objects_searchBy(attrName, attrValue, limit) {
        const db = database.open()

        const identifierAttr = {}
        identifierAttr[attrName] = attrValue

        let data = await database.search(db, this.table, identifierAttr, limit)

        let objects = data.map(d => new this(d))

        return objects
    }

    async change (attrName, attrValue) {
        const db = database.open()

        this.data[attrName] = attrValue

        const identifierAttr = {}
        identifierAttr["id"] = this.data.id

        await database.write(db, this.table, this.data, identifierAttr)

        return this
    }

    json () {
        let json = this.data
        return json
    }

    setData (data) {
        this.data = data
    }
}

module.exports = Model