const Model = require('./model')
const { generate_validation_code  } = require('./../utils/generators');

class Validation extends Model{
    static name = "Validation"
    static table = "validation"

    constructor (data = {}) {
        super(data)
    }

    static async create (type, user) {
        const data = {}
        data.type=type
        data.user=user.json()
        data.code = generate_validation_code()
        return this.__create(data)
    }
}

module.exports = Validation