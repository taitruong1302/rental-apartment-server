import * as services from '../services/acreageService'

export const getAcreage = async (req, res) => {
    try {
        const response = await services.getAcreageService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Error at Acreage controller ' + error
        })
    }
}