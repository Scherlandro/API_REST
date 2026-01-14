

export interface iItensVd {
  idItensVd: number;
  codVenda: number;
  codProduto: string;
  descricao: string;
  valCompra?: number;
  valVenda: number;
  qtdVendidas: number;
  descPorUnidade: number;
  valorParcial: number;
  dtRegistro: string;
  fotoProduto: any;
  highlighted?: boolean;
}
