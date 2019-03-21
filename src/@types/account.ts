export interface UserAccount {
  id: number,
  email: string,
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

export interface GetAccountBody {
  email: string
}

export interface GenerateTokenInfo {
  ctx: any,
  longLiveToken: boolean,
  registered: boolean,
  meta: {}
}
