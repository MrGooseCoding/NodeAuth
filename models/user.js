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
        
        return await this.__create()
    }

    static async authenticate (username, password) {
        const user = await this.objects_getBy("username", username)
        if (user["error"]) {
            return [false, user]
        }
        const match = await bcrypt.compare(password, user.data.password);
        return match ? [match, user] : [match, {}]
    }

    json (removePassword=true) {
        let json = this.data
        if (removePassword) {
            delete json["password"]
        }
        return json
    }
}

module.exports = User