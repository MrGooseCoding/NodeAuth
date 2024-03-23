const database = require('../database/database');
const { generate_hash } = require('../utils/generators');

class Validator {
    constructor(model, table, data) {
        this.model = model
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

        const raw_data_types = await this.model.get_data_types()
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
                formated_data[key] = value ? Number(value) : 0
            }
        }

        this.data = formated_data
    }

    async __create() {
        if (!this.data_valid) {
            return [false, this.errors]
        }
        try {

            this.model.create(this.data)
            
            const readable_data = {}
            
            for (var key in this.data) {
                if (!this.__write_only_attributes.includes(key) ) {
                    readable_data[key] = this.data[key]
                }
            }

    
            return [true, readable_data]

        } catch (e) {
            return [false, {error:'Invalid request'}]
        }
    }

    async unique (attrName) {
        const attrValue = this.data[attrName]
        const identifierAttr = {}
        identifierAttr[attrName] = attrValue

        const data = await database.get(
            this.db, this.table,
            identifierAttr
        );
        if (data[0]) {
            this.errors[attrName] = `${attrName} has to be unique`;
        }
        
        return !data[0];
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

    async encripted (attrName) {
        this.data[attrName] = await generate_hash(this.data[attrName])
        return true
    }

    no_whitespace (attrName) {
        const regex = /^\S+$/
        const valid = regex.test(this.data[attrName])

        if (!valid) {
            this.errors[attrName] = `${attrName} can not have whitespaces`
        }
        return valid
    }

    __user_readonly (attrName) {
        this.data[attrName] = this.data_types[attrName] === "string" ? "" : 0
        return true
    }

    __user_writeonly (attrName) {
        this.__write_only_attributes.push(attrName)
        return true
    }
}

module.exports = Validator