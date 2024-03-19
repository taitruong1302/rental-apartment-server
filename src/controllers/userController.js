import * as services from '../services/userService'

export const getCurrentUserInfor = async (req, res) => {
    const { id } = req.user
    try {
        const response = await services.getCurrentUserInfor(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Error at User controller ' + error
        })
    }
}

export const updateUserInfor = async (req, res) => {
    const { id } = req.user
    const payload = req.body
    try {
        if (!payload) {
            return res.status(200).json({
                err: 1,
                msg: "Missing field"
            })
        }
        const response = await services.updateUserInfor(id, payload)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Error at User controller ' + error
        })
    }
}