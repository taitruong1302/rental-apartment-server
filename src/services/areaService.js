import db from '../models'

export const getAreasService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Area.findAll({
            raw: true,
            attributes: ['code', 'value']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Cannot get areas.',
            response
        })
    } catch (error) {
        reject()
    }
})