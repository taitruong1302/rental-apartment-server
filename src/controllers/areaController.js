import * as services from '../services/areaService'

export const getAreas = async (req, res) => {
    try {
        const response = await services.getAreasService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Error at Area controller ' + error
        })
    }
}