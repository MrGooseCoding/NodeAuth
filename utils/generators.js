const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');

const encript_SaltRounds = 10
const validation_code_length = 6

function generate_validation_code() {
    return Math.floor(100000 + Math.random() * 900000)
}

function generate_uuid() {
    return uuidv4()
}

function generate_date_string(date = new Date()) {
    return date.toISOString().slice(0, 19).replace('T', ' ') + 'Z';
}

function generate_hash (value) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, encript_SaltRounds, (err, hash) => {
            resolve(hash)
        });
    });
}

module.exports = {generate_validation_code, generate_uuid, generate_date_string, generate_hash}