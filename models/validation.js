const Model = require('./model')
const userValidator = require('./../validators/userValidator')
const bcrypt = require('bcrypt');

class Validation extends Model{
    static name = "Validation"
    static table = "validation"

    constructor (data = {}) {
        super(data)
    }

    
}

module.exports = Validation