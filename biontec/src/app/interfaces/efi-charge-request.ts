
export interface EfiChargeRequest {
  idPagamento?: number;
  valor: number;
  pagador: {
    nome: string;
    cpf: string;
  };
  tipoPagamento: 'pix' | 'boleto';
  qrcodeImage?: any;
  copiaECola?: any;
}
