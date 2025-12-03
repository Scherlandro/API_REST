import {iItensOS} from "./itens-os";

export interface iServiceOrder {
  idOS: number,
  idCliente: number,
  nomeCliente: string,
  idFuncionario: number,
  nomeFuncionario: string,
  dt_OS: string,
  status: string,
  subtotal: string,
  desconto: string,
  totalGeralOS: string,
  itensOS: any

}
