export interface iProduto {

  idProduto: number,
  codProduto: string;
  codDoFabricante: number
  dtCadastro: string;
  ultimaAtualizacao: string;
  nomeProduto: string;
  corDoProduto?: number
  unidadeMedidas?: number
  obs: string;
  valorCompra: number
  percentual: number
  valorVenda: number
  qtdEstoque: number
  estoqueMinimo?: number
  qtdVendidas: number
  idFornecedor?: number
  idModelo?: number
  fotoProduto: any;
  highlighted?: boolean;

}
/*
  price: number;
  status: string;
  discounted: string;
  discount: number;
  name: string;
  description: string;
  image: string;

 */
