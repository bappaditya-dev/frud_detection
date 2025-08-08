const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID,
    brokers: [process.env.KAFKA_BROKER], // or your broker address
});

const producer = kafka.producer();

const produceTransaction = async (transactionData) => {
    try {
        await producer.connect();

        const message = {
            value: JSON.stringify(transactionData),
        };

        await producer.send({
            topic: 'transactions',
            messages: [message],
        });

        console.log('Message sent successfully:', transactionData);
        await producer.disconnect();
    } catch (err) {
        console.error('Error sending message:', err);
    }
};

module.exports = { produceTransaction };
