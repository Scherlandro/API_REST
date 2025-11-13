import {iProduto} from "./product";
import {iServiceOrder} from "./service-order";


export interface iItensOS {

  idItensDaOS?: number;
  cod0S: iServiceOrder;
  prod: iProduto;
  descricao: string;
  precoDeVenda: number;
  quantidade: number;
  total: number;
}

