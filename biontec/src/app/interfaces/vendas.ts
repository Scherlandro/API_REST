import {iItensVd} from "./itens-vd";
import {iProduto} from "./product";
import {ICliente} from "./cliente";

export interface iVendas {
  idVenda: number,
  cliente: ICliente,
  idFuncionario: number,
  nomeFuncionario: string,
  dtVenda: string,
  subtotal: number,
  desconto: number,
  totalgeral: number,
  formasDePagamento: string,
  qtdDeParcelas: number,
  itensVd: iItensVd[] | any,
  produtos?: iProduto[] | any,
  selecionado?:boolean
};

export type FaseVenda = 'newVd' | 'editarVd' | 'addItemVd' | 'editarItemVd';
//export interface FaseVenda{ newVd:'newVd' , editarVd:'editarVd' ,addItemVd: 'addItemVd' , editarItemVd: 'editarItemVd'}

