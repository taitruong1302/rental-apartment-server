import * as postService from '../services/postService'

export const getPosts = async (req, res) => {
    try {
        const response = await postService.getPostsService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}

export const getPostById = async (req, res) => {
    const { id } = req.query
    try {
        const response = await postService.getPostByIdService(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}

export const getLimitPosts = async (req, res) => {
    const { page, priceNumber, acreageNumber, ...query } = req.query
    try {
        const response = await postService.getLimitPostsService(page, query, { priceNumber, acreageNumber })
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}

export const getAdminLimitPosts = async (req, res) => {
    const { page, ...query } = req.query
    const { id } = req.user
    try {
        if (!id) return res.status(400).json({
            err: 1,
            msg: 'Missing fields'
        })
        const response = await postService.getAdminLimitPostsService(page, id, query)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}

export const getNewPosts = async (req, res) => {
    const { page, ...query } = req.query
    try {
        const response = await postService.getNewPostsService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}

export const createNewPost = async (req, res) => {
    try {
        const { categoryCode, title, priceNumber, acreageNumber, label } = req.body
        const { id } = req.user
        if (!categoryCode || !id || !title || !priceNumber || !acreageNumber || !label)
            return res.status(400).json({
                err: 1,
                msg: 'Missing fields'
            })
        const response = await postService.createNewPostService(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}

export const updatePost = async (req, res) => {
    const { postId, overviewId, imagesId, attributeId, ...payload } = req.body
    const { id } = req.user
    try {
        if (!postId || !id || !overviewId || !imagesId || !attributeId)
            return res.status(400).json({
                err: 1,
                msg: 'Missing inputs'
            })
        const response = await postService.updatePost(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}

export const deletePost = async (req, res) => {
    const { postId } = req.query
    const { id } = req.user
    try {
        if (!postId || !id) {
            return res.status(400), json({
                err: 1,
                msg: 'Missing Field'
            })
        }
        const response = await postService.deletePost(postId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller ' + error
        })
    }
}