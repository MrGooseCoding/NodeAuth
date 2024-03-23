const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt');

const encript_SaltRounds = 10

function generate_random_uuid() {
    return uuidv4()
}

function generate_current_date() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
}

function generate_hash (value) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(value, encript_SaltRounds, (err, hash) => {
            resolve(hash)
        });
    });
}

module.exports = {generate_random_uuid, generate_current_date, generate_hash}