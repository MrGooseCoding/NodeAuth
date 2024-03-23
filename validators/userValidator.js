const Validator = require('./validator')
const util = require('util')
const config = require('./../config.js')
const send_email = require('../utils/send_email');

const username_regex = /^(?![_.])[0-9a-zA-Z._+]+(?<![_.])$/
const email_regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

class userValidator extends Validator {
    constructor (data) {
        super('users', data)
    }
    
    // Configure this however you like

    id_valid () {
        return (
            this.__user_readonly("id")
        )
    }

    async email_valid () {
        return (
            this.not_null("email") &&
            this.max_length("email", 254) &&
            this.follows_regex("email", email_regex) && 
            await this.unique("email")
        )
    }

    async username_valid () {
        return (
            this.not_null("username") &&
            this.max_length("username", 20) &&
            this.follows_regex("username", username_regex) &&
            await this.unique("username")
        )
    }

    async password_valid () {
        return (
            this.not_null("password") &&
            this.min_length("password", 8) &&
            this.max_length("password", 15) &&
            this.no_whitespace("password") &&
            await this.encripted("password") &&
            this.__user_writeonly("password")
        )
    }

    display_name_valid () {
        return (
            this.not_null("display_name") && 
            this.max_length("display_name", 30)
        )
    }

    description_valid () {
        return (
            this.max_length("description", 5000)
        )
    }

    status_valid () {
        return (
            this.__user_readonly("status")
        )
    }

    date_created_valid () {
        return (
            this.__user_readonly("date_created")
        )
    }

    token_valid () {
        return (
            this.__user_readonly("token")
        )
    }

    async validate_all() {
        const id_valid = this.id_valid()
        const email_valid = await this.email_valid()
        const username_valid = await this.username_valid()
        const password_valid = await this.password_valid()
        const display_name_valid = this.display_name_valid()
        const description_valid = this.description_valid()
        const status_valid = this.status_valid()
        const date_created_valid = this.date_created_valid()
        const token_valid = this.token_valid()

        this.data_valid = 
            id_valid &&
            email_valid && 
            username_valid &&
            password_valid && 
            display_name_valid && 
            description_valid &&
            status_valid &&
            date_created_valid &&
            token_valid
    }

    async format_data () {
        await this.__format_data()

        if ( this.data["username"] ) {
            this.data["username"] = this.data["username"].toLowerCase()
        }

        if ( this.data["email"] ) {
            this.data["email"] = this.data["email"].toLowerCase()
        }
    }

    async send_validation_email() {
        let opts = {}
        opts.subject = util.format(config.validation_email.subject, config.appName)
        opts.text = util.format(config.validation_email.text, 
            this.data.display_name,
            ''
            )
        opts.to = this.data.email
        await send_email(opts)
    }

    async create () {
        return await this.__create()
    }

}

module.exports = userValidator