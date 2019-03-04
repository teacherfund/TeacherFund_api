export interface UserAccount {
  id: number,
  email: string,
  password?: string,
  firstName: string,
  lastName: string,
  role: string,
  meta: any,
}

export interface CreateAccountBody {
  email: string,
  firstName: string,
  lastName: string,
  role: string,
  meta?: any
}
