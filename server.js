require('dotenv').config();
const app = require('./app');
const startConsumer = require('./kafka/consumer');
const { connectDB } = require('./utils/db');
const PORT = process.env.PORT || 3000;
const Fraud = require('./models/fraud');

app.listen(PORT, async () => {
    await connectDB();
    await Fraud.sync(); // creates table if it doesn't exist
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    startConsumer();
});
