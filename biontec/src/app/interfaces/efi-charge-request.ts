
export interface EfiChargeRequest {
  idPagamento?: number;
  valor: number;
  pagador: {
    nome: string;
    cpf?: string;  // Opcional
    cnpj?: string; // Opcional
  };
  tipoPagamento: 'pix' | 'boleto';
  qrcodeImage?: any;
  copiaECola?: any;
}
