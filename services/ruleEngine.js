const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 10 });
const userTransactionTimestamps = {};

function evaluateFraudRules(transaction) {
    const violations = [];
    const { amount, location, userId, timestamp } = transaction;
    const time = new Date(timestamp).getTime();

    // Rule 1: Amount > $5000 and not USA
    if (amount > 5000 && location !== 'USA') {
        violations.push("High amount in non-USA location");
    }

    // Rule 2: Multiple transactions from same userId in < 10 seconds 

    //use node chache to store recent transaction timestamps
    const recent = cache.get(userId);
    if (recent) {
        const diff = new Date(timestamp) - new Date(recent);
        if (diff < 10000) violations.push('Multiple transactions in <10 seconds');
    }

    //use in memory to store recent transaction timestamps  
    //   if (!userTransactionTimestamps[userId]) {
    //     userTransactionTimestamps[userId] = [];
    //   }

    //   const recentTimestamps = userTransactionTimestamps[userId].filter(
    //     t => time - t < 10000
    //   );

    //   if (recentTimestamps.length > 0) {
    //     violations.push("Multiple transactions in <10 seconds");
    //   }

    //   userTransactionTimestamps[userId].push(time);

    // Rule 3: Round number
    if (amount % 1000 === 0) {
        violations.push("Round number divisible by 1000");
    }
    cache.set(userId, timestamp);
    return violations;
}

module.exports = evaluateFraudRules;
