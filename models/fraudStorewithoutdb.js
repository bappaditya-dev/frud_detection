const { kafka } = require('../kafka/kafkaClient');


const frauds = [];

function addFraud(transaction) {
  frauds.push(transaction);
}

function getAllFrauds() {
  return frauds;
}

function getFraudsByUser(userId) {
  return frauds.filter(f => f.userId === userId);
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

//   // DB check (PostgreSQL or SQLite)
//   try {
//     await sequelize.authenticate();
//     healthStatus.database = 'UP';
//   } catch (err) {
//     healthStatus.database = 'DOWN';
//   }

  const allHealthy = Object.values(healthStatus).every(status =>
    ['UP', 'EXISTS'].includes(status)
  );

  res.status(allHealthy ? 200 : 500).json(healthStatus);
};

module.exports = { addFraud, getAllFrauds, getFraudsByUser, healthCheck };
