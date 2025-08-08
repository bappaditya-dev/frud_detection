const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER],
    retry: {
        retries: 5,
    },
});

module.exports = { kafka };
