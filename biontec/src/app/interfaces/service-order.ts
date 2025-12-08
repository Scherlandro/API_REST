
export interface iServiceOrder {
  idOS: number,
  idCliente: number,
  nomeCliente: string,
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
  itensOS: any
  /*
  gestorDaOS:null
  tecnicoEncarregado:null
   */
}

