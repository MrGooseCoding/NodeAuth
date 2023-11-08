const express = require('express')
const router = express.Router()
const database = require('./../database/database')
const { v4: uuidv4 } = require('uuid');

const username_regex = /^(?![_.])[0-9a-zA-Z._+]+(?<![_.])$/
const email_regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/

router.post('/search/', async (req, res) => {
    const { username } = req.body

    if (!username) {
        return res.status(400).json({ error: 'Username is required'})
    }

    const db = database.open()
    database.query(db, 'users', {"username": username})
        .then(data => res.json(data))

    db.close()
    
})

router.post('/getById/', (req, res) => {
    const { id } = req.body

    if (!id) {
        return res.status(400).json({ error: 'Id is required'})
    }

    const db = database.open()
    database.get(db, 'users', {"id": id})
        .then(data => res.json(data[0]))

    db.close()
})

router.post('/create/', (req, res) => {
    const {username, display_name, email, description} = req.body

    const id = uuidv4()

    if (!username || !display_name || !email) {
        return res.status(400).json({ error: 'Username, display name and email are required are required'})
    }

    if (!username_regex.test(username)) {
        return res.status(400).json({ error: 'Username not valid. The username cannot include any special symbols appart from . and _, and cannot start with them either'})
    }

    if (!email_regex.test(email)) {
        return res.status(400).json({ error: 'Email not valid'})
    }

    const db = database.open()
    database.insert(db, 'users', 
        {id,
        email: email,
        username: new String(username).toLowerCase(),
        display_name,
        description: (description)?description:'',
    }).then(() => res.json()).catch((err)=> { 
        if (err.code === 'SQLITE_CONSTRAINT') {
            res.json({ error : 'Username and email have to be unique'})
        } else {
            res.json({ error: 'Invalid Request'})
        }
    })

    db.close()
})

/*router.post('/update/:attrName/', (req, res) => {
    const attrName = req.params.attrName
    const { attrValue } = req.body

    if (!attrName in ["username", "display_name", "description"]) {
        return res.status(400).json({ error: "Attribute name not valid"})
    }

    if (attrName == 'username' && !username_regex.test(attrValue)) {
        return res.status(400).json({ error: 'Username not valid. The username cannot include any special symbols appart from . and _, and cannot start with them either'})
    }

    if (!attrValue) {
        return res.status(400).json({ error: 'Attribute required'})
    }
    
    const db = database.open()
    database.write(db, 'users', {}[attrName] = attrValue)

    db.close()

}) */

module.exports = router