const Model = require('./model')
const { generate_validation_code, generate_date_string } = require('./../utils/generators');

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
        date.expire_date = generate_date_string(new Date().setTime(new Date().getTime() + (15*60*1000))) // 15 minutes

        // Check that the user doesn't have another validation object. If so, delete it.
        let existingValidations = await this.objects_getBy("user", user.json().id)
        if (!existingValidations["error"]) {

        }
        return this._create(data)
    }

    static async validate (code, user) {
        const result = this.objects_getBy("user", user.json().id)
        
        if (result["error"]) {
            return { error: "Validation does not exist" }
        }

        const date = new Date(result.json().expire_date)

        if (new Date() > date) {}
    }
}

module.exports = Validation