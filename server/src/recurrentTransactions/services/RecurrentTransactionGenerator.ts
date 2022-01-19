import { constants } from "fs";
import { access, readFile, writeFile } from "fs/promises";
import { Knex } from "knex";
import path from "path";
import RRule, { ByWeekday, Frequency, Weekday, WeekdayStr } from "rrule";
import db from "../../db";
import { createTransaction } from "../../transactions/queries";
import { findManyTransactionsById } from "../../transactions/queries/findManyTransactionsById";
import { findTransactionById } from "../../transactions/queries/findTransactionById";
import { Transaction, TransactionNew } from "../../transactions/types";
import { keyBy } from "../../utils/arrays";
import listRecurrentTransactionDefinitions from "../queries/listRecurrentTransactionDefinitions";
import markRecurrentTransactionAsFinished from "../queries/markRecurrentTransactionAsFinished";
import updateRecurrentTransactionDefinition from "../queries/updateRecurrentTransactionDefinition";
import { RecurrentTransactionDefinition } from "../types";

/**
 * Handles recurrent transaction generation.
 */
export default class RecurrentTransactionGenerator {
  private lastRunFilePath: string;

  private timeoutMs: number;

  private transactionProvider: Knex.TransactionProvider;

  constructor(cacheDir: string, cacheFileName: string, timeoutMs = 600 * 1000) {
    this.validateCacheDirCanBeAccessed(cacheDir);

    this.lastRunFilePath = path.join(path.normalize(cacheDir), cacheFileName);
    this.timeoutMs = timeoutMs;
    this.transactionProvider = db.transactionProvider();
  }

  /**
   * Validates that the cache dir can be accessed
   */
  private async validateCacheDirCanBeAccessed(cacheDir: string) {
    await access(cacheDir, constants.W_OK | constants.R_OK);
  }

  /**
   * Generates transactions if the generator was not run recently.
   *
   * "Recently" is defined by the `timeout`.
   *
   * @returns Whether it was necessary to generate transactions or not.
   */
  public async generateTransactionsIfNeeded(): Promise<boolean> {
    if (await this.wasRecentlyRun()) return false;

    const recurrentTransactions = await listRecurrentTransactionDefinitions({ finished: false });

    // We preload the base transactions to prevent an n+1 problem.
    // This opens the possibility of a 'Modified after read' type of error, but since the system
    // is not concurrently accessed it is impossible for that to happen.
    const baseTransactions = keyBy(
      await findManyTransactionsById(recurrentTransactions.map((r) => r.base_transaction_id)),
      "recurrence_id"
    );

    // const trx = await this.transactionProvider();
    // if (trx.isCompleted()) {
    //   return false;
    // }

    try {
      // console.log("generating new transactions");
      for (const r of recurrentTransactions) {
        const newTransaction = await this.tryToGenerateNextTransaction(r, baseTransactions[r.id]);
        if (newTransaction) {
          await this.createTransaction(newTransaction);
          await this.updateRecurrentTransactionLastGeneratedDate(r, newTransaction.date);
        }
      }
    } catch (error) {
      // console.log("rolling back");
      const trx = await this.transactionProvider();
      if (!trx.isCompleted()) trx.rollback(error);
    } finally {
      // console.log("committing");
      const trx = await this.transactionProvider();
      if (!trx.isCompleted()) trx.commit();
    }

    this.updateLastRun();
    return true;
  }

  /**
   * Checks if the generator was recently run.
   */
  private async wasRecentlyRun(): Promise<boolean> {
    // console.log("checking if generator was recently run");

    try {
      await access(this.lastRunFilePath, constants.R_OK);
    } catch (error) {
      // console.log("error trying to access cache", { error });
      return false;
    }

    const lastUpdatedString = await readFile(this.lastRunFilePath);
    const lastUpdated = Number.parseInt(lastUpdatedString.toString("utf8"), 10);

    // console.log("lastUpdated", {
    //   lastUpdatedString,
    //   lastUpdated,
    //   "Date.now() - lastUpdated": Date.now() - lastUpdated,
    //   timeoutMs: this.timeoutMs,
    // });

    if (Number.isNaN(lastUpdated)) return false;

    return Date.now() - lastUpdated < this.timeoutMs;
  }

  /**
   * Updates the last run information.
   */
  private async updateLastRun() {
    await writeFile(this.lastRunFilePath, Date.now().toString());
  }

  private parseFrequency(freq: RecurrentTransactionDefinition["recur_freq"]): Frequency {
    return (
      {
        SECONDLY: Frequency.SECONDLY,
        MINUTELY: Frequency.MINUTELY,
        HOURLY: Frequency.HOURLY,
        DAILY: Frequency.DAILY,
        WEEKLY: Frequency.WEEKLY,
        MONTHLY: Frequency.MONTHLY,
        YEARLY: Frequency.YEARLY,
      } as Record<RecurrentTransactionDefinition["recur_freq"], Frequency>
    )[freq];
  }

  private parseWeekday(weekday?: WeekdayStr): Weekday | undefined {
    if (!weekday) return weekday;

    return (
      {
        MO: RRule.MO,
        TU: RRule.TU,
        WE: RRule.WE,
        TH: RRule.TH,
        FR: RRule.FR,
        SA: RRule.SA,
        SU: RRule.SU,
      } as Record<WeekdayStr, Weekday>
    )[weekday];
  }

  /**
   * Generates a new transaction for the `recurrentTransaction` if its the rules allow so.
   *
   * If the `recurrentTransaction` should be mark as finished, the method does so and returns nothing.
   *
   * @returns The new transaction if its date has happened and nothing otherwise.
   */
  public async tryToGenerateNextTransaction(
    recurrentTransaction: RecurrentTransactionDefinition,
    baseTransaction?: Transaction
  ): Promise<TransactionNew | undefined> {
    if (recurrentTransaction.recur_until && recurrentTransaction.recur_until <= new Date()) {
      // This is intentionally not in a transaction since we want to mark this as finished even if
      // everything anything else fails.
      await markRecurrentTransactionAsFinished(recurrentTransaction);

      return;
    }

    const _baseTransaction =
      baseTransaction || (await findTransactionById(recurrentTransaction.base_transaction_id));

    const rRule = new RRule({
      freq: this.parseFrequency(recurrentTransaction.recur_freq),
      interval: recurrentTransaction.recur_interval,
      wkst: this.parseWeekday(recurrentTransaction.recur_wkst),
      dtstart: _baseTransaction.date,
      bymonth: recurrentTransaction.recur_bymonth?.map((d) => Number(d)),
      byweekno: recurrentTransaction.recur_byweekno?.map((d) => Number(d)),
      byyearday: recurrentTransaction.recur_byyearday?.map((d) => Number(d)),
      bymonthday: recurrentTransaction.recur_bymonthday?.map((d) => Number(d)),
      byweekday: recurrentTransaction.recur_byday as ByWeekday[],
      byhour: recurrentTransaction.recur_byhour?.map((d) => Number(d)),
      byminute: recurrentTransaction.recur_byminute?.map((d) => Number(d)),
      bysecond: recurrentTransaction.recur_bysecond?.map((d) => Number(d)),
      bysetpos: recurrentTransaction.recur_bysetpos?.map((d) => Number(d)),
      until: recurrentTransaction.recur_until,
      count: recurrentTransaction.recur_count,
    });

    const nextTransactionDate = rRule.after(recurrentTransaction.last_transaction_date);

    // If no date was generated, we either the `count` or `until` conditions were met.
    if (!nextTransactionDate) {
      // This is intentionally not in a transaction since we want to mark this as finished even if
      // everything anything else fails.
      await markRecurrentTransactionAsFinished(recurrentTransaction);

      return;
    }

    // If the transaction is yet to happen, we do not generated.
    if (nextTransactionDate > new Date()) {
      return;
    }

    return {
      type: _baseTransaction.type,
      account_id: _baseTransaction.account_id,
      category_id: _baseTransaction.category_id,
      recurrence_id: recurrentTransaction.id,
      description: _baseTransaction.description,
      transferred_to: _baseTransaction.transferred_to,
      amount: _baseTransaction.amount,
      date: nextTransactionDate,
    };
  }

  private async createTransaction(newTransaction: TransactionNew) {
    await createTransaction(newTransaction, await this.transactionProvider());
  }

  private async updateRecurrentTransactionLastGeneratedDate(
    recurrentTransaction: RecurrentTransactionDefinition,
    lastGenerated: Date
  ) {
    await updateRecurrentTransactionDefinition(
      recurrentTransaction.id,
      {
        ...recurrentTransaction,
        last_transaction_date: lastGenerated,
      },
      await this.transactionProvider()
    );
  }
}
