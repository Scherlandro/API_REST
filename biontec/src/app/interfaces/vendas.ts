import {iItensVd} from "./itens-vd";
import {iProduto} from "./product";

export interface iVendas {
  idVenda: number,
  idCliente: number,
  nomeCliente: string,
  idFuncionario: number,
  nomeFuncionario: string,
  dtVenda: string,
  subtotal: number,
  desconto: number,
  totalgeral: number,
  formasDePagamento: string,
  qtdDeParcelas: number,
  itensVd: iItensVd[] | any,
  produtos?: iProduto[] | any,
  selecionado?:boolean
}

