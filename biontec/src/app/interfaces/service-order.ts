import {iItensOS} from "./itens-os";
import {ICliente} from "./cliente";

export interface iServiceOrder {
  idOS: number,
  cliente: ICliente,
  idFuncionario: number,
  nomeFuncionario: string,
  dataDeEntrada: string,
  ultimaAtualizacao:string,
  status: string,
  subtotal: number,
  desconto: number,
  totalGeralOS: number,
  porConta:number,
  restante:number,
  itensOS: iItensOS[] | any
  /*
  gestorDaOS:null
  tecnicoEncarregado:null
   */
}

