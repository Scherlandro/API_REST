import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { iServiceOrder } from 'src/app/interfaces/service-order';
import { OrdemDeServicosService } from 'src/app/services/ordem-de-servicos.service';
import {ICliente} from "../../../interfaces/cliente";
import {debounceTime, distinctUntilChanged, Observable, of, Subject, switchMap, takeUntil} from "rxjs";
import {ClienteService} from "../../../services/cliente.service";
import {catchError, map, startWith} from "rxjs/operators";
import {IFuncionario} from "../../../interfaces/funcionario";
import {FuncionarioService} from "../../../services/funcionario.service";
import {ProductService} from "../../../services/product.service";
import {ItensOsService} from "../../../services/itens-os.service";
import {iProduto} from "../../../interfaces/product";
import {iItensOS} from "../../../interfaces/itens-os";
type ServiceSearchMethod<T> = (nome: string) => Observable<T[]>;

@Component({
  selector: 'app-dialog-open-os',
  templateUrl: './dialog-open-os.component.html',
  styleUrls: ['./dialog-open-os.component.css']
})
export class DialogOpenOsComponent implements OnInit {
  isChange = false;
  destroy$ = new Subject<void>();
  os: iServiceOrder;
  itensOS: iItensOS;
  osSelecionada!: iServiceOrder;
  funcionarioControl = new FormControl('', [Validators.required]);
  funcionarioFilted!: Observable<IFuncionario[]>;
  clientesFiltrados!: Observable<ICliente[]>;
  clienteControl = new FormControl('', [Validators.required]);

  produtos: iProduto[] = [];
  produtoFiltered: iProduto[] = [];
  produtoControl: FormControl;
  quantidadeControl: FormControl;

  clientes: ICliente[] = [];
  itensOS$: iItensOS[] = [];
  etapa = 1;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      modo: 'adicionar' | 'editar',
      idOS: number,
      nomeCliente: string,
      nomeFuncionario: string,
      itensOS: iItensOS
    },
    public dialogRef: MatDialogRef<DialogOpenOsComponent>,
    public osServices: OrdemDeServicosService,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private funcionarioServices: FuncionarioService,
    private itensOsService: ItensOsService,
    private productService: ProductService
  ) {

    this.os = data as any;        // mantém compatibilidade com seu código existente
    this.itensOS = data.itensOS;  // item selecionado (ou item vazio)

    this.isChange = data.modo === 'editar';

    this.verificarFuncionario();
    this.verificarCliente();

    this.produtoControl = new FormControl(null, [Validators.required]);
    this.quantidadeControl = new FormControl(
      this.itensOS.quantidade || 1,
      [Validators.required, Validators.min(1)]
    );
  }


  ngOnInit(): void {
    this.listarProdutos();

    // Se estiver no modo editar, já preenche o produto e quantidade
    if (this.data.modo === 'editar') {
      this.produtoControl.setValue({
        nomeProduto: this.itensOS.descricao,
        codProduto: this.itensOS.codProduto,
        valorVenda: this.itensOS.valorUnitario
      });

      this.quantidadeControl.setValue(this.itensOS.quantidade);
    }
  }


  ngOnDestroy() {
   // this.destroy$.next();
    this.destroy$.complete();
  }

  listarProdutos() {
    this.productService.getTodosProdutos().pipe(
      catchError(() => {
        console.error('Erro ao buscar produtos');
        return of([]);
      }),
      takeUntil(this.destroy$)
    ).subscribe((produtos: iProduto[]) => {
      this.produtos = produtos;
      this.produtoFiltered = produtos;
    });
  }

  save(os: iServiceOrder) {
    if (this.clienteControl.invalid || this.funcionarioControl.invalid) {
      this.onError('Preencha todos os campos obrigatórios');
      return;
    }

    const cliente: any = this.clienteControl.value;
    const funcionario: any = this.funcionarioControl.value;
    const dataAtual = new Date();

    os.nomeCliente = cliente.nomeCliente;
    os.nomeFuncionario = funcionario.nomeFuncionario;
    os.dataDeEntrada = dataAtual.toLocaleDateString('pt-BR');
    os.itensOS = this.itensOS;

    if (this.isChange) {
      this.osServices.update(os).pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (osAtualizada) => {
            this.dialogRef.close(osAtualizada);
          },
          error: (err) => {
            this.onError('Erro ao atualizar a OS');
            console.error(err);
          }
        });
    } else {
      this.osServices.create(os).pipe(takeUntil(this.destroy$))
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
  }

  salvarItem() {
    this.itensOS.quantidade = this.quantidadeControl.value;
    this.updateTotal();

    this.dialogRef.close({
      modo: this.data.modo,
      item: this.itensOS
    });
  }

  addItem() {
    const produtoSelecionado = this.produtoControl.value;
    if (produtoSelecionado && this.produtoControl.valid) {
  /*    const novoItem: iItensOS = {
        idItensDaOS: this.os.itensOS.idItensDaOS,
        codOS: this.os.idOS || 0,
        descricao: produtoSelecionado.nomeProduto,
        codProduto: produtoSelecionado.codProduto,
        valorUnitario: produtoSelecionado.valorVenda,
        quantidade: 1,
        total: produtoSelecionado.valorVenda // Inicialmente, o total é apenas o valor unitário
      };
      console.log(novoItem);*/
     // this.itensOS.push(novoItem);
      this.produtoControl.reset(); // Limpa o campo após adicionar o item
    }
  }

  removeItem(item: iItensOS) {
    const index = this.itensOS$.indexOf(item);
    if (index >= 0) {
      this.itensOS$.splice(index, 1);
    }
  }


 listarEntidade<T>(
    control: FormControl,
    serviceMethod: ServiceSearchMethod<T>,
    errorMsg: string
  ) {
    if (control.valid) {
      const value = control.value;
      if (typeof value === 'string') {
        serviceMethod(value).pipe(
          takeUntil(this.destroy$)
        ).subscribe({
          complete(): void {
          },
          next: (result: T[]) => {
            if (result.length > 0) {
              this.etapa = 2;
            } else {
              this.onError(errorMsg);
            }
          },
          error: (error: any) => {
            if (error.status === 404) {
              this.onError(`Erro ao buscar ${errorMsg}.`);
            }
          }
        });
      } else {
        this.etapa = 2;
      }
    }
  }

 listarClientes() {
    this.listarEntidade<ICliente>(
      this.clienteControl,
      (nome: string) => this.clienteService.getClientePorNome(nome),
      'Cliente não encontrado'
    );
  }

  listarFuncionario() {
    this.listarEntidade<IFuncionario>(
      this.funcionarioControl,
      (nome: string) => this.funcionarioServices.getFuncionarioPorNome(nome),
      'Funcionario não encontrado'
    );
  }

  verificarCliente() {
    this.listarClientes();
    this.clientesFiltrados = this.clienteControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.handleFilter(value, 'cliente')),
      takeUntil(this.destroy$)
    );
  }

  verificarFuncionario() {
    this.listarFuncionario();
    this.funcionarioFilted = this.funcionarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(value => this.handleFilter(value, 'funcionario')),
      takeUntil(this.destroy$)
    );
  }

  handleFilter(value: any, type: 'cliente' | 'funcionario'): Observable<any[]> {
   if (typeof value === 'string' && value.length >= 2  ) {
      return type === 'cliente'
        ? this.clienteService.getClientePorNome(value).pipe(
          catchError(() => {
            console.error('Erro ao buscar clientes');
            return of([]);
          })
        )
        : this.funcionarioServices.getFuncionarioPorNome(value).pipe(
        catchError(() => {
          console.error('Erro ao buscar funcionarios');
          return of([]);
        })
      )
    }
    return of([]);
  }

  filterProdutos(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    if (valor) {
      this.produtoFiltered = this.produtos.filter(p =>
        p.nomeProduto.toLowerCase().includes(valor.toLowerCase()));
    } else {
      this.produtoFiltered = this.produtos.slice();
    }
  }

  onProdutoSelecionado(produto: iProduto): void {
    if (produto) {
      this.updateItemFields(produto);
    }
  }

  displayFn(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }

 displayFnFunc(func: IFuncionario): string {
    return func ? func.nomeFuncionario : '';
  }

  displayPd(produto: iProduto): string {
    return produto ? produto.nomeProduto : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selecionarCliente(): void {
    this.dialogRef.close(this.clientes);
  }

  statusDaOS(){
    if (this.os.idOS != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  onError(message: string) {
    console.error(message);
  }

  onCancel() {
    this.voltar();
    this.dialogRef.close();
  }

  voltar(): void {
    if (this.etapa === 2) {
      this.etapa = 1;
    }
  }

  // Função para atualizar os campos do itensOS com base no produto selecionado
  updateItemFields(produto: iProduto) {
    this.itensOS.codProduto = produto.codProduto;
    this.itensOS.descricao = produto.nomeProduto;
    this.itensOS.valorUnitario = produto.valorVenda;
    this.updateTotal();
  }

  // Função para atualizar o total com base no preço de venda e quantidade
  updateTotal() {
    if (this.itensOS.valorUnitario && this.itensOS.quantidade) {
      this.itensOS.total = this.itensOS.valorUnitario * this.itensOS.quantidade;
    } else {
      this.itensOS.total = 0;
    }
  }

  formatter(value: number): string {
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
  }
  // Método que valida se o botão "Salvar" deve ser habilitado
  isSaveButtonDisabled(): boolean {
    return !(this.produtoControl.valid && this.quantidadeControl.valid);
  }

}
