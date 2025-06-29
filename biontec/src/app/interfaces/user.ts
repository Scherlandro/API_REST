export interface IUser {
  id_usuario :number,
    name: string,
    username: string,
    password: string,
  //  createdAt: string,
   // updatedAt: string,
   // deletedAt: null | string
}

export interface ISingleUser{
    data: IUser
}

export interface IDataUser{
    data: IUser[]
}

export interface ITokenUser{
    id: number,
    name: string,
    username: string,
    iap?: number,
    exp?: number
}
