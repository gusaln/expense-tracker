import { Static } from '@sinclair/typebox';
import { ExpenseTransaction } from '../transactions/types';
import ExpenseNewSchema from './schemas/expenseNew.schema';
import ExpenseUpdateSchema from './schemas/expenseUpdate.schema';

export type Expense = Omit<ExpenseTransaction, 'type'>

export type ExpenseNew = Omit<Static<typeof ExpenseNewSchema>, 'date'> & {date: Date}
export type ExpenseUpdate = Omit<Static<typeof ExpenseUpdateSchema>, 'date'> & {date: Date}

export type ExpenseDbId = string | number;
export type ExpenseDbRecord = Omit<Expense, 'id'> & { id: ExpenseDbId }
