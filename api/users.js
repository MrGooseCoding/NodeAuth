const express = require('express')
const router = express.Router()
const User = require('../models/user')
const api = require('./api')

api('/search/', async (req, res, validator, user) => {
    if (!validator.not_null("username")) {
        return res.status(400).json(validator.errors)
    }
    
    const data = await User.objects_searchBy("username", validator.data.username, 10)
    return res.status(200).json(data)

}, router, User)

api('/getByToken/', (req, res, validator, user) => {
    res.status(user.data ? 200 : 400).json(user.data ? user.data : validator.errors)
}, router, User, true)

api('/getById/', async (req, res, validator, user) => {
    if (!validator.not_null("id")) {
        return res.status(400).json(validator.errors)
    }
    
    const data = await User.objects_getBy("id", validator.data.id)
    return res.status(data[0] ? 200 : 400).json(data[1])
}, router, User)

api('/create/', async (req, res, validator, user) => {
    await validator.validate_all()
    validator.generate_current_date("date_created")
    validator.generate_token()

    const data = await validator.create()
    return res.status(data[0] ? 201 : 400).json(data[1])
}, router, User)

api('/update/:attrName/', async (req, res, validator, user) => {
    const options = [
        //"email",
        "username",
        "display_name",
        "description",
        "password"
    ]

    const attrName = req.params.attrName

    if (!options.includes(attrName)) {
        return res.status(400).json({error: "Invalid attribute name"})
    }

    await validator.validate_all()
    if (validator.errors[attrName]) {
        const error = {}
        error[attrName] = validator.errors[attrName]
        return res.json(error)
    }


    await user.change(attrName, validator.data[attrName])
    return res.status(201).json(user.data)

}, router, User, true)

api('/login/', async (req, res, validator, user) => {
    if (!validator.not_null("username")) {
        return res.status(400).json(validator.errors)
    }
    const is_unique = await validator.unique("username")

    if (is_unique) {
        return res.status(400).json({"username": "username does belong to any user"})
    }

    delete validator.errors["username"]
    const password_valid = await validator.password_valid()
    if (!password_valid) {
        const errors = {}
        errors["password"] = validator.errors.password
        return res.status(400).json(validator.errors)
    }

    result = await User.authenticate(validator.data.username, req.body.password)
    return res.status(r[0] ? 201: 400).json(result[0] ? result[1] : {"password": "incorrect password"})

    
}, router, User)

module.exports = router