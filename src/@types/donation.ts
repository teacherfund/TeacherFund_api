export interface Donation {
  id: number,
  amount: number,
  frequency: string,
  meta: any
}

export enum Frequency {
  Monthly = 'monthly',
  biannual = 'biannual',
  annual = 'annual',
}
