import cache from "../config/cache";
import app from "./app";
import RecurrentTransactionGenerator from "./recurrentTransactions/services/RecurrentTransactionGenerator";

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */

  new RecurrentTransactionGenerator(
    cache.cacheDir,
    "lastTimeGenerated"
  ).generateTransactionsIfNeeded();
});
