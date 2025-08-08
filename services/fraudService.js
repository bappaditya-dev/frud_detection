const { addFraud } = require('../models/fraudStore');
const evaluateFraudRules = require('./ruleEngine');
const logger = require('../utils/logger');


function processTransaction(transaction) {
    logger.info("Received transaction", { transactionId: transaction.transactionId, userId: transaction.userId });

    const violations = evaluateFraudRules(transaction);

    if (violations.length > 0) {
        logger.warn("Fraud detected", {
            transactionId: transaction.transactionId,
            userId: transaction.userId,
            violations,
            timestamp: transaction.timestamp,
        });

        addFraud({ ...transaction, violations });
    }
}

module.exports = processTransaction;
