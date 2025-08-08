const retryQueue = [];

function addToRetryQueue(transaction, attempt = 1) {
  const delay = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
  console.log(`Retrying transaction ${transaction.transactionId} in ${delay / 1000}s (attempt ${attempt})`);

  setTimeout(() => {
    retryQueue.push({ transaction, attempt });
  }, delay);
}

function processRetryQueue(processFunction) {
  setInterval(() => {
    if (retryQueue.length === 0) return;

    const { transaction, attempt } = retryQueue.shift();

    try {
      processFunction(transaction);
    } catch (err) {
      if (attempt < 3) {
        addToRetryQueue(transaction, attempt + 1);
      } else {
        console.error(`Transaction ${transaction.transactionId} failed after 3 attempts.`);
      }
    }
  }, 1000);
}

module.exports = { addToRetryQueue, processRetryQueue };
