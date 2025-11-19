import {iProduto} from "./product";
import {iServiceOrder} from "./service-order";


export interface iItensOS {

  idItensDaOS?: number;
  codOS: iServiceOrder;
  prod?: iProduto;
  codProduto: string;
  descricao: string;
  valorUnitario: number;
  quantidade: number;
  total: number;
}

