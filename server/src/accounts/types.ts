import { Static } from '@sinclair/typebox';
import Money from '../support/money/money';
import AccountSchema from './schemas/account.schema';

export interface Account extends Omit<Static<typeof AccountSchema>, 'current_balance' | 'created_at' | 'updated_at'> {
  current_balance: Money,
  created_at: Date,
  updated_at: Date,
}

export type AccountNew = Pick<Account, 'name' | 'icon' | 'color' | 'currency'>
export type AccountUpdate = Omit<AccountNew, 'currency'>

export type AccountDbId = string | number;
export type AccountDbRecord = Omit<Account, 'id' | 'current_balance'> & { id: AccountDbId, current_balance: number }