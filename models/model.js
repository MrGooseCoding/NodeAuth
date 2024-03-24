const database = require('./../database/database')

class Model {
    constructor (data) {
        this.data = data
    }

    static async __create () {
        const db = database.open()

        await database.insert(db, this.table, data).then(data => data)
        return new User(data)
    }

    static async get_data_types() {
        const db = database.open()
        return await database.getDataTypes(db, this.table)
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

        database.write(db, this.table, this.data, identifierAttr)
        return this
    }

    json () {
        let json = this.data
        if (removePassword) {
            delete json["password"]
        }
        return json
    }

    setData (data) {
        this.data = data
    }
}

module.exports = Model