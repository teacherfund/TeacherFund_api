export interface Donation {
  id: number,
  amount: number,
  frequency: string,
  userId: number,
  meta: any
}

export enum Frequency {
  Monthly = 'Monthly',
  Biannual = 'Biannual',
  Annual = 'Annual',
}
