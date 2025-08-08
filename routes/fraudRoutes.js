const express = require('express');
const router = express.Router();
const { getAllFrauds, getFraudsByUser, healthCheck } = require('../models/fraudStore');
const { produceTransaction } = require('../kafka/producer');


/**
 * @swagger
 * /frauds:
 *   get:
 *     summary: Get all flagged (suspicious) transactions
 *     responses:
 *       200:
 *         description: List of frauds
 */
router.get('/frauds', getAllFrauds);

/** 
 * @swagger
 * /frauds/{userId}:
 *   get:
 *     summary: Get fraud transactions for a specific user
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of frauds for that user
 */
router.get('/frauds/:userId', getFraudsByUser);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: OK status
 */
router.get('/health', healthCheck);



/**
 * @swagger
 * /send:
 *   post:
 *     summary: Simulate sending a transaction to Kafka
 *     description: Produces a transaction message to Kafka for testing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: string
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               location:
 *                 type: string
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Transaction sent successfully
 *       500:
 *         description: Kafka error
 */
router.post('/send', async (req, res) => {
    try {
        const payload = req.body;
        await produceTransaction(payload);
        res.status(200).json({ message: 'Produced successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to produce' });
    }
});

module.exports = router;
