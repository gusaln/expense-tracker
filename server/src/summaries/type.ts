export interface Balance {
  currency: string;
  balance: number;
}
export type BalanceByCurrency = Record<string, number>;
