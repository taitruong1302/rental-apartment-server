import db from '../models'
import { Op } from 'sequelize'
import { v4 as generateId } from 'uuid'
import generateCode from '../utils/generateCode'
import moment from 'moment'
import generateDate from '../utils/generateDate'

export const getPostsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attribute', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] }
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Get posts unsuccessfully',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getPostByIdService = (id) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findOne({
            where: { id: id },
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attribute', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
                { model: db.Overview, as: 'overview' }
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Get post by id unsuccessfully',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getLimitPostsService = (page, { limit, order, ...query }, { priceNumber, acreageNumber }) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query }
        if (priceNumber)
            queries.priceNumber = { [Op.between]: priceNumber }
        if (acreageNumber)
            queries.acreageNumber = { [Op.between]: acreageNumber }
        if (order)
            queries.order = [order]
        const response = await db.Post.findAndCountAll({
            where: query,
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            limit: +process.env.LIMIT,
            ...queries,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attribute', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
                { model: db.Overview, as: 'overview' }
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Get posts unsuccessfully',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const getNewPostsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            offset: 0,
            order: [['createdAt', 'DESC']],
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attribute', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            ],
            attributes: ['id', 'title', 'star', 'createdAt']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Get posts unsuccessfully',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const createNewPostService = (body, userId) => new Promise(async (resolve, reject) => {
    try {
        const attributeId = generateId()
        const imagesId = generateId()
        const overviewId = generateId()
        const labelCode = generateCode(body.label)
        const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`
        const currentDate = generateDate()
        await db.Post.create({
            id: generateId(),
            title: body.title || null,
            labelCode,
            address: body.address || null,
            attributeId,
            categoryCode: body.categoryCode || null,
            description: JSON.stringify(body.description) || null,
            userId,
            overviewId,
            imagesId,
            acreageCode: body.acreageCode || null,
            priceCode: body.priceCode || null,
            areaCode: body?.area?.includes('Thành phố') ? generateCode(body?.area?.replace('Thành phố', '')) : generateCode(body?.area?.replace('Tỉnh', '')) || null,
            priceNumber: body.priceNumber,
            acreageNumber: body.acreageNumber
        })
        await db.Attribute.create({
            id: attributeId,
            price: +body.priceNumber < 1 ? `${+body.priceNumber * 1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.acreageNumber} m2`,
            published: moment(new Date).format('DD/MM/YYYY'),
            hashtag,
        })
        await db.Image.create({
            id: imagesId,
            image: JSON.stringify(body.images)
        })
        await db.Overview.create({
            id: overviewId,
            code: hashtag,
            area: body.label,
            type: body?.category,
            target: body?.target,
            bonus: 'Normal Post',
            created: currentDate.today,
            expired: currentDate.expireDay,
        })
        await db.Area.findOrCreate({
            where: {
                [Op.or]: [
                    { value: body?.area?.replace('Thành phố', '') },
                    { value: body?.area?.replace('Tỉnh', '') }
                ]
            },
            defaults: {
                code: body?.area?.includes('Thành phố') ? generateCode(body?.area?.replace('Thành phố', '')) : generateCode(body?.area?.replace('Tỉnh', '')),
                value: body?.area?.includes('Thành phố') ? body?.area?.replace('Thành phố', '') : body?.area?.replace('Tỉnh', '')
            }
        })
        await db.Label.findOrCreate({
            where: {
                code: labelCode
            },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })
        resolve({
            err: 0,
            msg: 'OK',
        })
    } catch (error) {
        reject(error)
    }
})

export const getAdminLimitPostsService = (page, id, query) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query, userId: id }
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            limit: +process.env.LIMIT,
            order: [['createdAt', 'DESC']],
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attribute', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
                { model: db.Overview, as: 'overview' }
            ],
            // attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Get posts unsuccessfully',
            response
        })
    } catch (error) {
        reject(error)
    }
})

export const updatePost = ({ postId, overviewId, imagesId, attributeId, ...body }) => new Promise(async (resolve, reject) => {
    try {
        const labelCode = generateCode(body.label)
        await db.Post.update({
            title: body.title || null,
            labelCode,
            address: body.address || null,
            categoryCode: body.categoryCode || null,
            description: JSON.stringify(body.description) || null,
            acreageCode: body.acreageCode || null,
            priceCode: body.priceCode || null,
            areaCode: body?.area?.includes('Thành phố') ? generateCode(body?.area?.replace('Thành phố', '')) : generateCode(body?.area?.replace('Tỉnh', '')) || null,
            priceNumber: body.priceNumber,
            acreageNumber: body.acreageNumber
        }, {
            where: { id: postId }
        })
        await db.Attribute.update({
            price: +body.priceNumber < 1 ? `${+body.priceNumber * 1000000} đồng/tháng` : `${body.priceNumber} triệu/tháng`,
            acreage: `${body.acreageNumber} m2`,
        }, {
            where: { id: attributeId }
        })
        await db.Image.update({
            image: JSON.stringify(body.images)
        }, {
            where: { id: imagesId }
        })
        await db.Overview.update({
            area: body.label,
            type: body?.category,
            target: body?.target,
        }, {
            where: { id: overviewId }
        })
        await db.Area.findOrCreate({
            where: {
                [Op.or]: [
                    { value: body?.area?.replace('Thành phố', '') },
                    { value: body?.area?.replace('Tỉnh', '') }
                ]
            },
            defaults: {
                code: body?.area?.includes('Thành phố') ? generateCode(body?.area?.replace('Thành phố', '')) : generateCode(body?.area?.replace('Tỉnh', '')),
                value: body?.area?.includes('Thành phố') ? body?.area?.replace('Thành phố', '') : body?.area?.replace('Tỉnh', '')
            }
        })
        await db.Label.findOrCreate({
            where: {
                code: labelCode
            },
            defaults: {
                code: labelCode,
                value: body.label
            }
        })
        resolve({
            err: 0,
            msg: 'Update Successfully',
        })
    } catch (error) {
        reject(error)
    }
})

export const deletePost = (postId) => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.destroy({
            where: { id: postId }
        })
        resolve({
            err: response > 0 ? 0 : 1,
            msg: response > 0 ? 'OK' : 'No post deleted',
            response
        })
    } catch (error) {
        reject(error)
    }
})