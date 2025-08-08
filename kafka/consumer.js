const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const processTransaction = require('../services/fraudService');
const { processRetryQueue, addToRetryQueue } = require('../utils/retry');


dotenv.config();

const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

async function startConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: 'transactions', fromBeginning: false });

    // Start retry queue processor
    processRetryQueue(processTransaction);

    await consumer.run({
        eachMessage: async ({ message }) => {
            try {
                const transaction = JSON.parse(message.value.toString());
                processTransaction(transaction);
            } catch (err) {
                console.error("Initial processing failed:", err.message);
                const transaction = JSON.parse(message.value.toString());
                addToRetryQueue(transaction);
            }
        }
    });

    process.on('SIGINT', async () => {
        console.log("Shutting down gracefully...");
        await consumer.disconnect();
        process.exit(0);
    });
}

module.exports = startConsumer;
