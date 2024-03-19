import db from '../models'

export const getAcreageService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Acreage.findAll({
            raw: true,
            attributes: ['code', 'value', 'order']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Cannot get prices.',
            response
        })
    } catch (error) {
        reject()
    }
})