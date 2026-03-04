
export interface EfiChargeRequest {
  idPagamento?: number;
  valor: number;
  numberCard?: number;
  pagador: {
    nome: string;
    cpf?: string;
    cnpj?: string;
  };
  tipoPagamento: 'pix' | 'boleto';
  qrcodeImage?: any;
  copiaECola?: any;
}
