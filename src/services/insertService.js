import db from '../models'
import bcrypt from 'bcryptjs'
import { v4 } from 'uuid'
require('dotenv').config()
import chothuecanho from '../../data/chothuecanho.json'
import chothuematbang from '../../data/chothuematbang.json'
import nhachothue from '../../data/nhachothue.json'
import chothuephongtro from '../../data/chothuephongtro.json'
import generateCode from '../utils/generateCode'
import { dataPrice, dataArea } from '../utils/data'
import { getNumberFromString, getNumberFromStringV2 } from '../utils/common'
const dataBody = [
    {
        body: chothuephongtro.body,
        code: 'CTPT'
    },
    {
        body: chothuematbang.body,
        code: 'CTMB'
    },
    {
        body: chothuecanho.body,
        code: 'CTCH'
    },
    {
        body: nhachothue.body,
        code: 'NCT'
    },
]

const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(12))

export const insertService = () => new Promise(async (resolve, reject) => {
    try {
        const areaCodes = []
        const labelCodes = []
        dataBody.forEach(cate => {
            cate.body.forEach(async (item) => {
                let postId = v4()
                let labelCode = generateCode(item?.header?.class?.classType).trim()
                labelCodes?.every(item => item?.code !== labelCode) && labelCodes.push({
                    code: labelCode,
                    value: item?.header?.class?.classType?.trim()
                })
                let areaCode = generateCode(item?.header?.address?.split(',')?.slice(-1)[0]).trim()
                areaCodes?.every(item => item?.code !== areaCode) && areaCodes.push({
                    code: areaCode,
                    value: item?.header?.address?.split(',')?.slice(-1)[0].trim()
                })
                let attributeId = v4()
                let userId = v4()
                let imagesId = v4()
                let overviewId = v4()
                let desc = JSON.stringify(item?.mainContent?.content)
                let currentAcreage = getNumberFromString(item?.header?.attributes?.acreage)
                let currentPrice = getNumberFromString(item?.header?.attributes?.price)
                await db.Post.create({
                    id: postId,
                    title: item?.header?.title,
                    star: item?.header?.star,
                    labelCode,
                    address: item?.header?.address,
                    attributeId,
                    categoryCode: cate.code,
                    description: desc,
                    userId,
                    overviewId,
                    imagesId,
                    acreageCode: dataArea.find(area => area.max > currentAcreage && area.min <= currentAcreage)?.code,
                    priceCode: dataPrice.find(area => area.max > currentPrice && area.min <= currentPrice)?.code,
                    areaCode,
                    priceNumber: getNumberFromStringV2(item?.header?.attributes?.price),
                    acreageNumber: getNumberFromStringV2(item?.header?.attributes?.acreage)
                })
                await db.Attribute.create({
                    id: attributeId,
                    price: item?.header?.attributes?.price,
                    acreage: item?.header?.attributes?.acreage,
                    published: item?.header?.attributes?.published,
                    hashtag: item?.header?.attributes?.hashtag,
                })
                await db.Image.create({
                    id: imagesId,
                    image: JSON.stringify(item?.images)
                })
                await db.Overview.create({
                    id: overviewId,
                    code: item?.overview?.content.find(i => i.name === "Mã tin:")?.content,
                    area: item?.overview?.content.find(i => i.name === "Khu vực")?.content,
                    type: item?.overview?.content.find(i => i.name === "Loại tin rao:")?.content,
                    target: item?.overview?.content.find(i => i.name === "Đối tượng thuê:")?.content,
                    bonus: item?.overview?.content.find(i => i.name === "Gói tin:")?.content,
                    created: convertDateFormat(item?.overview?.content.find(i => i.name === 'Ngày đăng:')?.content).toString(),
                    expired: convertDateFormat(item?.overview?.content.find(i => i.name === "Ngày hết hạn:")?.content).toString(),
                })
                await db.User.create({
                    id: userId,
                    name: item?.contact?.content.find(i => i.name === "Liên hệ:")?.content,
                    password: hashPassword('123'),
                    phone: item?.contact?.content.find(i => i.name === "Điện thoại:")?.content,
                    zalo: item?.contact?.content.find(i => i.name === "Zalo")?.content,
                })
            })
        })
        areaCodes?.forEach(async (item) => {
            await db.Area.create(item)
        })
        labelCodes?.forEach(async (item) => {
            await db.Label.create(item)
        })
        dataPrice.forEach(async (item, index) => {
            await db.Price.create({
                code: item.code,
                value: item.value,
                order: index + 1
            })
        })
        dataArea.forEach(async (item, index) => {
            await db.Acreage.create({
                code: item.code,
                value: item.value,
                order: index + 1
            })
        })
        resolve('Done.')
    } catch (error) {
        reject(error)
    }
})

// export const createPricesAndAreas = () => new Promise((resolve, reject) => {
//     try {
//         dataPrice.forEach(async (item, index) => {
//             await db.Price.create({
//                 code: item.code,
//                 value: item.value,
//                 order: index + 1
//             })
//         })
//         dataArea.forEach(async (item, index) => {
//             await db.Acreage.create({
//                 code: item.code,
//                 value: item.value,
//                 order: index + 1
//             })
//         })
//         resolve('OK')
//     } catch (err) {
//         reject(err)
//     }
// })


function convertDateFormat(inputDate) {
    // Split the input date string into components
    const dateParts = inputDate.split(' ');
    const time = dateParts[0];
    const date = dateParts[1];

    // Split the time component into hours and minutes
    const [hours, minutes] = time.split(':');

    // Split the date component into day, month, and year
    const [day, month, year] = date.split('/');

    // Create a new Date object in the desired format
    const newDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}`);

    // Format the newDate as "yyyy-mm-dd hh:mm"
    const formattedDate = newDate.toISOString().slice(0, 16).replace('T', ' ');

    return formattedDate;
}