const express = require('express')
const router = express.Router()
const database = require('./../database/database')
const userValidator = require('../validators/userValidator')

router.post('/search/', async (req, res) => {
    const validator = new userValidator(req.body)

    validator.format_data().then(() => {
        if (!validator.not_null("username")) {
            return res.status(400).json(validator.errors)
        }
        
        const db = database.open()

        database.query(db, 'users', {"username": validator.data.username}, 10)
            .then(data => {
                data.map((v) => {
                    delete v["password"]
                })

                res.json(data)
            })

        db.close()
    })
})

router.post('/getById/', (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ error: 'Id is required'})
    }

    const db = database.open()
    database.get(db, 'users', {"id": id})
        .then(data => {
            if (!data) {
                return res.json({})
            }
            delete data["password"] // It is write-only
            res.json(data)
        })

    db.close()
})

router.post('/create/', (req, res) => {
    const validator = new userValidator(req.body)

    validator.validate_all().then(() => {
        validator.generate_current_date("date_created")
        return validator.create()
    }).then((data) => {
        res.status(data[0] ? 201 : 400).json(data[1])
    })
    
})

/*router.post('/update/:attrName/', (req, res) => {
    const attrName = req.params.attrName
    const { attrValue } = req.body

    const validator = new userValidator(req.body)

    const options = {
        "email": validator.email_valid,
        "username": validator.username_valid,
        "display_name": validator.display_name_valid,
        "description": validator.description_valid,
        "password": validator.password_valid
    }
    
    const db = database.open()
    database.write(db, 'users', {}[attrName] = attrValue)

    db.close()

})*/

module.exports = router