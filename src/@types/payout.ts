export interface Payout {
  id: number,
  amount: number,
  teacherId: number,
  description: string,
  location: string, // lat long for snapmap
  meta: {}
}
