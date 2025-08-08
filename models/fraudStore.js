// models/fraudStore.js
const Fraud = require('./fraud');
const { sequelize } = require('../utils/db');
const { kafka } = require('../kafka/kafkaClient');

async function addFraud(fraud) {
    console.log(fraud);
    await Fraud.create({
        transactionId: fraud.transactionId,
        userId: fraud.userId,
        amount: fraud.amount,
        location: fraud.location,
        timestamp: fraud.timestamp,
        reasons: fraud.violations.join(', '),
    });
}

const getAllFrauds = async (req, res) => {
    try {
        let alldata = await Fraud.findAll({ raw: true });
        res.json(alldata);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
}


const getFraudsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        let data = await Fraud.findAll({ where: { userId } });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }

}

const healthCheck = async (req, res) => {
    const healthStatus = {
        server: 'UP',
        kafka: 'DOWN',
        topic: 'UNKNOWN',
        database: 'DOWN'
    };

    // Kafka check
    try {
        const admin = kafka.admin();
        await admin.connect();
        healthStatus.kafka = 'UP';

        const topics = await admin.listTopics();
        healthStatus.topic = topics.includes('transactions') ? 'EXISTS' : 'MISSING';

        await admin.disconnect();
    } catch (error) {
        console.log(error);
        healthStatus.kafka = 'DOWN';
        healthStatus.topic = 'ERROR';
    }

    // DB check (PostgreSQL or SQLite)
    try {
        await sequelize.authenticate();
        healthStatus.database = 'UP';
    } catch (err) {
        healthStatus.database = 'DOWN';
    }

    const allHealthy = Object.values(healthStatus).every(status =>
        ['UP', 'EXISTS'].includes(status)
    );

    res.status(allHealthy ? 200 : 500).json(healthStatus);
};
module.exports = {
    addFraud,
    getAllFrauds,
    getFraudsByUser,
    healthCheck
};
