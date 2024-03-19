'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Attribute extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Attribute.hasOne(models.Post, { foreignKey: 'attributeId', as: 'attribute' })
        }
    }
    Attribute.init({
        price: DataTypes.STRING,
        acreage: DataTypes.STRING,
        published: DataTypes.STRING,
        hashtag: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Attribute',
        freezeTableName: true
    });
    return Attribute;
};