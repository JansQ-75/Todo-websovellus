import fs from 'fs'
import path from 'path'
import { pool } from './db.js'
import jwt from 'jsonwebtoken'
import { hash } from 'bcrypt'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const insertTestUser = (user) => {
    hash(user.password, 10, (err, hashedPassword) => {
        if(err) {
            console.error('Error hashing password', err)
            return
        }
        pool.query('INSERT INTO account (email,password) VALUES ($1,$2)',
            [user.email, hashedPassword],
            (err, result) => {
                if (err) {
                console.error('Error inserting test user:', err)
                } else {
                    console.log('Test user inserted successfully')
                }
            })
    })
}

const initializeTestDb = () => {
    const sql = fs.readFileSync(path.resolve(__dirname, '../database.sql'), 'utf8')

    pool.query(sql, (err) => {
        if (err) {
            console.error('Error initializing test database')
        }
        else {
            console.log('Test database initialized succesfully')
        }
    })
}

const getToken = (email) => {
    return jwt.sign({ email }, process.env.JWT_SECRET_KEY)
}

export { initializeTestDb, insertTestUser, getToken }