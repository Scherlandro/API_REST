import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormControl, Validators} from "@angular/forms";
import {VendasService} from "../../../services/vendas.service";
import {catchError, map, startWith} from "rxjs/operators";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {ErrorDiologComponent} from "../error-diolog/error-diolog.component";
import {each} from "chart.js/dist/helpers";
import {ICliente} from "../../../interfaces/cliente";
import {ClienteService} from "../../../services/cliente.service";
import {iVendas} from "../../../interfaces/vendas";
import {iProduto} from "../../../interfaces/product";
import {IFuncionario} from "../../../interfaces/funcionario";
import {FuncionarioService} from "../../../services/funcionario.service";
import {ProductService} from "../../../services/product.service";
import {iItensVd} from "../../../interfaces/itens-vd";

@Component({
  selector: 'app-dialog-open-sales',
  templateUrl: './dialog-open-sales.component.html',
  styleUrls: ['./dialog-open-sales.component.css']
})
export class DialogOpenSalesComponent implements  OnInit, OnDestroy  {

  destroy$ = new Subject<void>();
  isChange!: boolean;
  listProd: any;
  etapa = 1;
  vendaSelecionada: any;
  venda!: iVendas;
  itensVd: iItensVd;
  funcionarioControl = new FormControl('', [Validators.required]);
  funcionarioFilted!: Observable<IFuncionario[]>;
  clientesFiltrados!: Observable<ICliente[]>;
  clienteControl = new FormControl('', [Validators.required]);
  clientes: ICliente[] = [];
  isNewVd: boolean;
  produtos: iProduto[] = [];
  produtoFiltered: iProduto[] = [];
  produtoControl: FormControl;
  quantidadeControl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dialogRef: MatDialogRef<DialogOpenSalesComponent>,
    public vendaServices: VendasService,
    public dialog: MatDialog,
    public clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private productService: ProductService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.venda = data as any;
    this.itensVd = data.itensVd;
    this.isChange = data.modo === 'adicionar';
    this.isNewVd = data.modoNew === 'editar';
    this.produtoControl = new FormControl();
    this.quantidadeControl = new FormControl(
      this.itensVd?.qtdVendidas || 1,      [Validators.required, Validators.min(1)]
    );
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value:any) => {
        if (typeof value === 'string') {
          return this.filtrarClientes(value);
        } else if (value && value.nomeCliente) {
          // Se for um objeto cliente (selecionado no autocomplete)
          return of([value]);
        } else {
          return of([]);
        }
      })
    );
  }

  ngOnInit(): void {
   this.listarClientes();
  }


  ngOnDestroy() {
    // this.destroy$.next();
    this.destroy$.complete();
  }

  private filtrarClientes(nome: string): Observable<ICliente[]> {
    if (nome.length < 2) {
      return of([]);
    }
    return this.clienteService.getClientePorNome(nome).pipe(
      catchError(() => {
        console.error('Erro ao buscar clientes');
        return of([]);
      })
    );
  }

  displayFn(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }

  displayPd(prod: iProduto):string{
    return prod ? prod.nomeProduto : '';
  }

  listarClientes() {
    if (this.clienteControl.valid) {
      const value = this.clienteControl.value;
      if (typeof value === 'string') {
        this.clienteService.getClientePorNome(value).subscribe(
          (result: ICliente[]) => {
            console.log('resutado do lista', result)
            if (result.length > 0) {
              this.etapa = 2;
            } else {
              this.onError('Cliente não encontrado');
            }
          },
          error => {
            if (error.status === 404) {
              this.onError('Erro ao buscar cliente.');
            }
          }
        );
      } else {
        // Já temos um cliente selecionado
        this.etapa = 2;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  // =============== AUTOCOMPLETE ==================
  // ===============================================

  setupAutocompleteFilters() {
    this.funcionarioFilted = this.funcionarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length >= 1
          ? this.funcionarioService.getFuncionarioPorNome(value)
          : of([])
      ),
      catchError(() => of([])),
      takeUntil(this.destroy$)
    );

    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length >= 1
          ? this.clienteService.getClientePorNome(value)
          : of([])
      ),
      catchError(() => of([])),
      takeUntil(this.destroy$)
    );


  }


  selecionarCliente(): void {
    this.dialogRef.close(this.clientes);
  }

  verificarStatus(){
    if (this.venda.idVenda != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save(vd: any):void{
      console.log('ClienteControl ', this.clienteControl.status , 'funcionario', this.funcionarioControl.invalid)
      /*  if (this.clienteControl.invalid || this.funcionarioControl.invalid) {
           this.onError('Preencha todos os campos obrigatórios');
           return;
         }*/

      const cliente: any = this.clienteControl.value;
      const funcionario: any = this.funcionarioControl.value;
      const dataAtual = new Date();

      // ATENÇÃO: Se o autocomplete já tiver um objeto, pegamos a propriedade.
      // Se o usuário não mudou nada, ou se o controle for apenas texto, tratamos aqui:

      if (cliente && typeof cliente === 'object') {
        vd.idCliente = cliente.idCliente;
        vd.nomeCliente = cliente.nomeCliente;
      }

      if (funcionario && typeof funcionario === 'object') {
        vd.idFuncionario = funcionario.idFuncionario;
        vd.nomeFuncionario = funcionario.nomeFuncionario;
      }

    vd.dataDeEntrada = vd.dataDeEntrada || dataAtual.toISOString();
    vd.ultimaAtualizacao = dataAtual.toISOString();
    vd.itensVd = this.itensVd;



      if(vd.modo === 'adicionar' && vd.modoNew === 'adicionar') {
        this.vendaServices.addVenda(vd).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (osCriada) => {
              this.dialogRef.close(osCriada);
            },
            error: (err) => {
              this.onError('Erro ao criar a OS');
              console.error(err);
            }
          });
      }
      if (vd.modo === 'adicionar' && vd.modoNew === 'editar') {
        console.log('isChange no save ', this.isChange)
        this.vendaServices.updateVenda(vd).pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (osAtualizada) => {
              this.dialogRef.close(osAtualizada);
            },
            error: (err) => {
              this.onError('Erro ao atualizar a OS');
              console.error(err);
            }
          });
      }
    }

  voltar(): void {
    if (this.etapa === 2) {
      this.etapa = 1;
    }
  }


  listarProdutos() {
    this.productService.getTodosProdutos().pipe(
      catchError(() => {
        console.error('Erro ao buscar produtos');
        return of([]);
      }),
      //takeUntil(this.destroy$)
    ).subscribe((produtos: iProduto[]) => {
      this.produtos = produtos;
      this.produtoFiltered = produtos;
    });
  }

  filterProdutos(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.produtoFiltered = this.produtos.filter(p =>
      p.nomeProduto.toLowerCase().includes(valor)
    );
  }

  onProdutoSelecionado(produto: iProduto): void {
    if (produto) {
     /* this.itensVd.codProduto = produto.codProduto;
      this.itensVd.descricao = produto.nomeProduto;
      this.itensVd.valorUnitario = produto.valorVenda;
      this.updateTotal();*/
    }
  }
  displayCli(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }

  displayFunc(func: IFuncionario): string {
    return func ? func.nomeFuncionario : '';
  }


}
