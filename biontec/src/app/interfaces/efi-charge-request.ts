
export interface EfiChargeRequest {
  idPagamento?: number;
  valor: number;
  pagador: {
    nome: string;
    cpf?: string;
    cnpj?: string;
  };
  tipoPagamento: 'pix' | 'boleto';
  qrcodeImage?: any;
  copiaECola?: any;
}
