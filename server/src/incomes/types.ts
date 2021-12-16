import { Static } from '@sinclair/typebox';
import { IncomeTransaction } from '../transactions/types';
import IncomeNewSchema from './schemas/incomeNew.schema';
import IncomeUpdateSchema from './schemas/incomeUpdate.schema';

export type Income = Omit<IncomeTransaction, 'type'>

export type IncomeNew = Omit<Static<typeof IncomeNewSchema>, 'date'> & { date: Date }
export type IncomeUpdate = Omit<Static<typeof IncomeUpdateSchema>, 'date'> & { date: Date }

export type IncomeDbId = string | number;
export type IncomeDbRecord = Omit<Income, 'id'> & { id: IncomeDbId }
