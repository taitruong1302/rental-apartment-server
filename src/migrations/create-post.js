'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Post', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            title: {
                type: Sequelize.STRING
            },
            star: {
                type: Sequelize.STRING,
                defaultValue: '0'
            },
            labelCode: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            attributeId: {
                type: Sequelize.STRING
            },
            categoryCode: {
                type: Sequelize.STRING
            },
            priceCode: {
                type: Sequelize.STRING
            },
            acreageCode: {
                type: Sequelize.STRING
            },
            areaCode: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.TEXT
            },
            userId: {
                type: Sequelize.STRING
            },
            overviewId: {
                type: Sequelize.STRING
            },
            imagesId: {
                type: Sequelize.STRING
            },
            priceNumber: {
                type: Sequelize.FLOAT
            },
            acreageNumber: {
                type: Sequelize.FLOAT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Post');
    }
};