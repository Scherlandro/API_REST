import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
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
export class DialogOpenOsComponent implements  OnInit, OnDestroy  {

  destroy$ = new Subject<void>();
  os!: iServiceOrder;
  itensOS: iItensOS;
  isNewOS = false;
  isChange = false; // TRUE = Editar item — FALSE = Adicionar item
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
      modoNew: 'nova' | '' ;
      modo: 'adicionar' | 'editar';
      os: iServiceOrder;
      itensOS: iItensOS;
    },
    public dialogRef: MatDialogRef<DialogOpenOsComponent>,
    public osServices: OrdemDeServicosService,
    public dialog: MatDialog,
    private clienteService: ClienteService,
    private funcionarioService: FuncionarioService,
    private itensOsService: ItensOsService,
    private productService: ProductService
  ) {
    this.os = data as any;
    this.itensOS = data.itensOS;  // item selecionado (ou item vazio)
    console.log('Valor OS ', this.os)
    this.isChange = data.modo === 'editar';
    this.isNewOS = data.modoNew === 'nova';
    this.produtoControl = new FormControl(null, [Validators.required]);
    this.quantidadeControl = new FormControl(
      this.itensOS?.quantidade || 1,      [Validators.required, Validators.min(1)]
    );
  }


  ngOnInit(): void {
    this.listarProdutos();
    this.setupAutocompleteFilters();
    this.statusDaOS();

    // Se estiver no modo editar, já preenche o produto e quantidade
    if (this.isChange) {
     /* this.produtoControl.setValue({
        nomeProduto: this.itensOS.descricao,
        codProduto: this.itensOS.codProduto,
        valorVenda: this.itensOS.valorUnitario
      });*/

      this.produtoControl.disable();

      this.quantidadeControl.setValue(this.itensOS.quantidade);
      console.log('isChange', this.isChange, 'isNewOS', this.isNewOS);
    }
  }


  ngOnDestroy() {
   // this.destroy$.next();
    this.destroy$.complete();
  }

  // =============== AUTOCOMPLETE ==================
  // ===============================================

  setupAutocompleteFilters() {
    this.funcionarioFilted = this.funcionarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(value =>
        typeof value === 'string' && value.length >= 2
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
        typeof value === 'string' && value.length >= 2
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

  filterProdutos(event: Event): void {
    const valor = (event.target as HTMLInputElement).value.toLowerCase();
    this.produtoFiltered = this.produtos.filter(p =>
      p.nomeProduto.toLowerCase().includes(valor)
    );
  }

  onProdutoSelecionado(produto: iProduto): void {
    if (produto) {
      this.itensOS.codProduto = produto.codProduto;
      this.itensOS.descricao = produto.nomeProduto;
      this.itensOS.valorUnitario = produto.valorVenda;
      this.updateTotal();
    }
  }

  // Atualiza total ao editar quantidade
  updateTotal() {
    const qtd = Number(this.itensOS.quantidade);
    const valor = Number(this.itensOS.valorUnitario);
    this.itensOS.total = qtd * valor || 0;
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

    if (this.produtoControl.invalid || this.quantidadeControl.invalid) {
      this.onError("Preencha todos os campos obrigatórios.");
      return;
    }
    this.updateTotal();

    this.dialogRef.close({
      modo: this.data.modo,
      item: this.itensOS
    });
  }

  addItem() {
    const produtoSelecionado = this.produtoControl.value;

    if (!produtoSelecionado || this.produtoControl.invalid || this.quantidadeControl.invalid) {
      this.onError("Selecione o produto e uma quantidade válida.");
      return;
    }

    const novoItem: iItensOS = {
      idItensDaOS: 0, // item novo sempre inicia com 0
      codOS: this.os.idOS ?? 0,
      codProduto: String(produtoSelecionado.codProduto),
      descricao: String(produtoSelecionado.nomeProduto),
      valorUnitario: Number(produtoSelecionado.valorVenda),
      quantidade: Number(this.quantidadeControl.value),
      total: Number(produtoSelecionado.valorVenda) * Number(this.quantidadeControl.value)
    };

    // adiciona na lista
    this.itensOS$.push(novoItem);

    // limpa os campos
    this.produtoControl.reset();
    this.quantidadeControl.reset();

    // feedback no console
    console.log("Item adicionado:", novoItem);
  }

  removeItem(item: iItensOS) {
    const index = this.itensOS$.indexOf(item);
    if (index >= 0) {
      this.itensOS$.splice(index, 1);
    }
  }

  displayCli(cliente: ICliente): string {
    return cliente ? cliente.nomeCliente : '';
  }

  displayFunc(func: IFuncionario): string {
    return func ? func.nomeFuncionario : '';
  }

  displayPd(produto: iProduto): string {
    return produto ? produto.nomeProduto : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  statusDaOS(){
    console.log('os.idOS NO STATUS', this.os.idOS)
    if (this.os.idOS != null) {
      this.isNewOS = true;
      this.isChange = true;
    } else {
      this.isChange = false;
      this.isNewOS = false;
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

  formatter(value: number): string {
    return new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(value);
  }
  // Método que valida se o botão "Salvar" deve ser habilitado
  isSaveButtonDisabled(): boolean {
    return !(this.produtoControl.valid && this.quantidadeControl.valid);
  }

}
