const sqlite3 = require('sqlite3').verbose()
const { dbPath } = require('./../config')

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

const format = (value) => `${(typeof value === "string")?`"${value}"`:value}`

function get(db, table, identifierAttr) {
    return new Promise((resolve, reject) => {
        const attrName = Object.keys(identifierAttr)[0]
        const attrValue = identifierAttr[attrName]

        const sql = `SELECT * FROM ${table} WHERE ${attrName} = ${format(attrValue)}`
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows[0])
            }
        })
    })
}

function query(db, table, identifierAttr, limit) {
    return new Promise((resolve, reject) => {
        const attrName = Object.keys(identifierAttr)[0]
        const attrValue = identifierAttr[attrName]

        const sql = `SELECT * FROM ${table} WHERE ${attrName} LIKE '%${attrValue}%' LIMIT ${limit}`
        db.all(sql, (err, rows) => {
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
    
        const sql = `UPDATE ${table} SET ${setClause} WHERE ${attrName} = ${format(attrValue)}`;
        
        db.run(sql, values, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        });
    })
}

function getDataTypes(db, table) {
    return new Promise((resolve, reject) => {
        const sql = `PRAGMA table_info(${table})`
        db.all(sql, (err, rows) => {
            if (err) {
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}


module.exports = {open, close, get, getDataTypes, query, insert, write}