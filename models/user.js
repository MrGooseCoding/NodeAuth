const Model = require('./model')
const bcrypt = require('bcrypt');
const { generate_uuid, generate_current_date } = require('./../utils/generators');
const database = require('../database/database')

class User extends Model{
    static name = "User"
    static table = "users"

    constructor (data = {}) { // Note that this method does not insert anything in the database
        "initializes a User class, without inserting anything in the database"
        super(data)
    }

    static async create(data) { 
        data.id = generate_uuid()
        data.token = generate_uuid()
        data.date_created = generate_current_date()
        
        const db = database.open()

        await database.insert(db, this.table, data).then(data => data)
        return new User(data)
    }

    static async objects_getBy (attrName, attrValue) {
        const data = await this.__objects_getBy(attrName, attrValue);

        return data[0] ? new User(data[1]) : data[1]
    }

    static async objects_searchBy (attrName, attrValue, limit) {
        const data = await this.__objects_searchBy(attrName, attrValue, limit)
        
        let users = []
        data.map(d => {users.push(new User(d))})

        return users
    }

    static async authenticate (username, password) {
        const user = await this.objects_getBy("username", username)
        if (user["error"]) {
            return [false, user]
        }
        const match = await bcrypt.compare(password, user.data.password);
        return match ? [match, user] : [match, {}]
    }

    async change (attrName, attrValue) {
        var data = await this.__change(User.table, attrName, attrValue)

        return new User(data)
    }

    json (removePassword=true) {
        let json = this.data
        if (removePassword) {
            delete json["password"]
        }
        return json
    }
    /*if (removePassword && data[0]) {
            delete data[1]["password"]; // It is write-only
        }
        if (removePassword) {
            data.map((v) => {
                delete v["password"]
            })
        }*/
}

module.exports = User