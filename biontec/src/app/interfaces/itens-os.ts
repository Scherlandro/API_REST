import {iProduto} from "./product";
import {iServiceOrder} from "./service-order";


export interface iItensOS {

  idItensDaOS?: number;
  codOS: iServiceOrder;
  prod?: iProduto;
  codProd: string;
  descricao: string;
  precoDeVenda: number;
  quantidade: number;
  total: number;
}

