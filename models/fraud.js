// models/Fraud.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');

const fraud = sequelize.define('fraud', {
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    reasons: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = fraud;
