const database = require('../database/database')
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const encript_SaltRounds = 10

class Validator {
    constructor(table, data) {
        this.table = table
        this.data = data
        this.errors = {}
        this.data_valid = false
        this.__write_only_attributes = []
        this.db = database.open()
    }

    async get_data_types() {
        this.data_types = {}
        const data_types_transform = {
            'TEXT': 'string',
            'INTEGER': 'int',
            'DATETIME': 'string'
        }
        const raw_data_types = await database.getDataTypes(this.db, this.table)
        raw_data_types.forEach(element => {
            this.data_types[element.name] = data_types_transform[element.type]
        });
    }

    async __format_data() {
        await this.get_data_types()

        var formated_data = {}
        for (var key in this.data_types) {
            const value = this.data[key]

            if (this.data_types[key] === 'string') {
                formated_data[key] = value ? String(value).trim() : ""
            } else {
                formated_data[key] = value ? Number(value) : null
            }
        }

        this.data = formated_data
    }

    async create() {
        if (!this.data_valid) {
            return [false, this.errors]
        }
        try {

            this.generate_id()
            const db = database.open()
    
            await database.insert(db, this.table, this.data).then(data => data)
            
            const readable_data = {}
            
            for (var key in this.data) {
                if (!this.__write_only_attributes.includes(key) ) {
                    readable_data[key] = this.data[key]
                }
            }

            db.close()
    
            return [true, readable_data]

        } catch (e) {
            console.log(e)
            return [false, {error:'Invalid request'}]
        }
    }

    unique (attrName) {
        const attrValue = this.data[attrName]
        const identifierAttr = {}
        identifierAttr[attrName] = attrValue

        return database.get(
            this.db, this.table, 
            identifierAttr
        ).then(data => {
            const valid = !data
            if (!valid) {
                this.errors[attrName] = `${attrName} has to be unique`
            }
            return valid
        })
    }

    not_null (attrName) {
        const valid = Boolean(this.data[attrName])

        if (!valid) {
            this.errors[attrName] = `${attrName} can not be null`
        }
        return valid
    }

    max_length (attrName, maxLength) {
        const l = this.data[attrName].length
        const valid = l <= maxLength

        if (!valid) {
            this.errors[attrName] = `${attrName} has to have a maximum of ${maxLength} characters`
        }
        return valid
    }

    min_length (attrName, maxLength) {
        const l = this.data[attrName].length
        const valid = l >= maxLength

        if (!valid) {
            this.errors[attrName] = `${attrName} has to have a minimum of ${maxLength} characters`
        }
        return valid
    }

    follows_regex (attrName, regex) {
        const valid = regex.test(this.data[attrName])

        if (!valid) {
            this.errors[attrName] = `${attrName} does not follow regex`
        }
        return valid
    }

    encripted (attrName) {
        return new Promise((resolve, reject) => {
            bcrypt.hash(this.data[attrName], encript_SaltRounds, (err, hash) => {
                this.data[attrName] = hash
                resolve(!err)
            });
        });
    }

    __user_readonly (attrName) {
        this.data[attrName] = this.data_types[attrName] === "string" ? "" : null
        return true
    }

    __user_writeonly (attrName) {
        this.__write_only_attributes.push(attrName)
        return true
    }

    generate_id() {
        this.data.id = uuidv4()
    }

    generate_token() {
        this.data.token = uuidv4()
    }

    generate_current_date(attrName) {
        this.data[attrName] = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

}

module.exports = Validator