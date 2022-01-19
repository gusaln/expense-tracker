import cache from "../config/cache";
import RecurrentTransactionGenerator from "./recurrentTransactions/services/RecurrentTransactionGenerator";

new RecurrentTransactionGenerator(
  cache.cacheDir,
  "lastTimeGenerated"
).generateTransactionsIfNeeded();
