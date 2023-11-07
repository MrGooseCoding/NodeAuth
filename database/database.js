const sqlite3 = require('sqlite3').verbose()

const dbPath = './database.db'

function open() {
    return new sqlite3.Database(dbPath);
}

function close(db) {
    db.close((err) => {
      if (err) {
        console.error(err.message);
      }
    });
}

function get(db, table, identifierAttr) {
    return new Promise((resolve, reject) => {
        const attrName = Object.keys(identifierAttr)[0]
        const attrValue = identifierAttr[attrName]
        db.all(`SELECT * FROM ${table} WHERE ${attrName} = ${attrValue}`, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

function insert(db, table, data) {
    return new Promise((resolve, reject) => {
        const keys = Object.keys(data);
        const placeholders = keys.map(() => '?');
        const values = keys.map(key => data[key]);

        const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders.join(', ')})`

        console.log(sql)

        const stmt = db.prepare(sql);
        stmt.run(...values, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
        stmt.finalize();
    })
}

function write(db, table, data, identifierAttr) {
    return new Promise((resolve, reject) => {
        const attrName = Object.keys(identifierAttr)[0]
        const attrValue = identifierAttr[attrName]
        const keys = Object.keys(data)
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const values = [...keys.map(key => data[key])];
    
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${attrName} = ${attrValue}`;
        
        db.run(sql, values, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        });
    })
}

module.exports = {open, close, get, insert, write}