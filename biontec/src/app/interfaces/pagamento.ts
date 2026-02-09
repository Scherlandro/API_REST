export interface iPagamento {
  idPagamento?: number;
  valorPago: number;
  dtPagamento?: string;
  formaPagamento: string;
  status: number;
  origemId: number;
  tipoOrigem: string; // Ex: 'VENDA', 'Ordem de Servico', 'Contas a Pagar'
}
