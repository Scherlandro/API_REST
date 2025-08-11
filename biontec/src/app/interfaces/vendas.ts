import {iItensVd} from "./itens-vd";

export interface iVendas {
  idVenda: number,
  idCliente: number,
  nomeCliente: string,
  idFuncionario: number,
  nomeFuncionario: string,
  dtVenda: string,
  subtotal: string,
  desconto: string,
  totalgeral: string,
  formasDePagamento: string,
  qtdDeParcelas: number,
  itensVd: iItensVd[]
 /*   updatedAt?: string,
    createdAt?: string,
    deletedAt?: null | string*/
}

export interface ISingleVendas {
    data: iVendas
}

export interface IDataVendas {
    data: iVendas[]
}
