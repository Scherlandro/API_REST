import {iItensVd} from "./itens-vd";
import {iProduto} from "./product";

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
  itensVd: iItensVd[],
  produtos: iProduto[],
  selecionado?:boolean
}

export interface ISingleVendas {
    data: iVendas
}

export interface IDataVendas {
    data: iVendas[]
}
