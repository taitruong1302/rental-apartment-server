import db from '../models'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 } from 'uuid'
require('dotenv').config()

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

export const registerService = (body) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOrCreate({
            where: { phone: body.phone },
            defaults: {
                phone: body.phone,
                name: body.name,
                password: hashPassword(body.password),
                id: v4()
            }
        })
        const token = response[1] && jwt.sign({ id: response[0].id, phone: response[0].phone }, process.env.SECRET_KEY, { expiresIn: '2d' })
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Register successfully' : 'User is already exist!',
            token: token || null
        })
    } catch (error) {
        reject(error)
    }
})

export const loginService = (body) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.User.findOne({
            where: { phone: body.phone },
            raw: true
        })
        const isCorrectPassword = response && bcrypt.compareSync(body.password, response.password)
        const token = isCorrectPassword && jwt.sign({ id: response.id, phone: response.phone }, process.env.SECRET_KEY, { expiresIn: '2d' })
        resolve({
            err: token ? 0 : 2,
            msg: token ? 'Login successfully' : 'Phone or Password is incorrect',
            token: token || null
        })
    } catch (error) {
        reject(error)
    }
})