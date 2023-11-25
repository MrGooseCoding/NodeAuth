const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const api = require('./api')

api('/search/', (req, res, validator, user) => {
    if (!validator.not_null("username")) {
        return res.status(400).json(validator.errors)
    }
    
    user.objects_filterBy("username", validator.data.username, 10).then((data) => {
        res.json(data)
    })
}, router, User)

api('/create/', (req, res, validator, user) => {
    validator.validate_all().then(() => {
        validator.generate_current_date("date_created")
        validator.generate_token()
        return validator.create()
    }).then((data) => {
        res.status(data[0] ? 201 : 400).json(data[1])
    })  
}, router, User)

api('/getByToken/', (req, res, validator, user) => {
    res.status(user.data ? 201 : 400).json(user.data ? user.data : validator.errors)
}, router, User)

api('/getById/', (req, res, validator, user) => {
    if (!validator.not_null("id")) {
        return res.status(400).json(validator.errors)
    }
    
    User.objects_getBy("id", validator.data.id).then((data) => {
        res.status(data[0] ? 201 : 400).json(data[1])
    })
}, router, User)

api('/update/:attrName/', (req, res, validator, user) => {
    const options = [
        "email",
        "username",
        "display_name",
        "description",
        "password"
    ]

    const attrName = req.params.attrName

    if (!options.includes(attrName)) {
        return res.status(400).json({error: "Invalid attribute name"})
    }

    validator.validate_all().then(() => {
        if (validator.errors[attrName]) {
            const error = {}
            error[attrName] = validator.errors[attrName]
            return res.json(error)
        }

        user.change(attrName, validator.data[attrName]).then(() => {
            res.json(user.data)
        })
    })
}, router, User, true)

api('/login/', (req, res, validator, user) => {
    if (!validator.not_null("username")) {
        return res.status(400).json(validator.errors)
    }
    validator.unique("username").then((unique) => {
        if (unique) {
            return res.status(400).json({"username": "username does belong to any user"})
        }

        delete validator.errors["username"]
        validator.password_valid().then((valid) => {
            if (!valid) {
                const errors = {}
                errors["password"] = validator.errors.password
                return res.status(400).json(validator.errors)
            }

            User.authenticate(validator.data.username, req.body.password).then((r) => {
                return res.status(r[0] ? 201: 400).json(r[0] ? r[1] : {"password": "incorrect password"})
                
            })

        })
    })
    
}, router, User)

module.exports = router