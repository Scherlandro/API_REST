import {ICliente} from "./cliente";

export interface iPagamento {
  idPagamento?: number;
  pagador: ICliente;
  valorPago: number;
  dtPagamento?: string;
  formaPagamento: string;
  numeroCartao?: number;
  status: number;
  origemId: number;
  tipoOrigem: string; // Ex: 'VENDA', 'Ordem de Servico', 'Contas a Pagar'
}
