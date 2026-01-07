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
  isNewOS : boolean;
  isChange: boolean;
  osSelecionada!: iServiceOrder;
  funcionarioControl = new FormControl('', [Validators.required]);
  funcionarioFilted!: Observable<IFuncionario[]>;
  clientesFiltrados!: Observable<ICliente[]>;
  clienteControl = new FormControl('', [Validators.required]);
  statusOsFiltrados!: Observable<any>;
  statusOsControl = new FormControl('', [Validators.required]);

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
      modoNew: 'adicionar' | 'editar' ;
      modo:'editar' |'adicionar'  ;
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
   this.isChange = data.modo === 'adicionar';
    this.isNewOS = data.modoNew === 'editar';
    this.produtoControl = new FormControl();
    this.quantidadeControl = new FormControl(
      this.itensOS?.quantidade || 1,      [Validators.required, Validators.min(1)]
    );
  }


  ngOnInit(): void {
    this.listarProdutos();
    this.setupAutocompleteFilters();
    if (this.itensOS && this.itensOS.quantidade) {
      // emitEvent: false evita que o subscribe abaixo seja disparado desnecessariamente na inicialização
      this.quantidadeControl.setValue(this.itensOS.quantidade, { emitEvent: false });
    }

    this.quantidadeControl.valueChanges.subscribe(novoValor => {
      // Verifica se o valor é válido antes de atribuir
      if (this.os?.itensOS) {
        this.os.itensOS.quantidade = novoValor;
        this.updateTotal();
      }
    });
    // Se estiver editando, força o cálculo inicial do total
    if (this.isChange) {
      this.updateTotal();
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

    this.statusOsFiltrados = this.statusOsControl.valueChanges.pipe(
      startWith(''), // Começa vazio para mostrar opções ao focar
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(value => {
        // Se for objeto (selecionado), pegamos o valor string. Se nulo, string vazia.
        const busca = typeof value === 'string' ? value : '';
        return this.osServices.getStatus(busca);
      }),
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

  updateTotal() {
    const qtd = Number(this.itensOS.quantidade);
    const valor = Number(this.itensOS.valorUnitario);
    this.itensOS.total = qtd * valor || 0;
  }

  iniciarOS() {
    if (this.clienteControl.invalid || this.funcionarioControl.invalid) {
      this.onError('Preencha cliente e atendente');
      return;
    }

    const cliente: any = this.clienteControl.value;
    const funcionario: any = this.funcionarioControl.value;

    const osParaCriar: iServiceOrder = {
      idOS: 0,
      idCliente: cliente.idCliente,
      nomeCliente: cliente.nomeCliente,
      idFuncionario: funcionario.idFuncionario,
      nomeFuncionario: funcionario.nomeFuncionario,
      dataDeEntrada: new Date().toISOString(),
      ultimaAtualizacao: new Date().toISOString(),
      status: 'OS_EM_ANDAMENTO',
      subtotal: 0,
      desconto: 0,
      totalGeralOS: 0,
      porConta: 0,
      restante: 0,
      itensOS: []
    };

    this.osServices.create(osParaCriar).subscribe({
      next: (osCriada) => {
        this.os = osCriada;
        this.isChange = false;
        this.isNewOS = true;
      },
      error: () => this.onError('Erro ao iniciar OS')
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
    os.dataDeEntrada = dataAtual.toISOString();
    os.status = os.status || 'OS_em_Andamento';
    os.itensOS = this.itensOS ;

    if (!this.isChange) {
   console.log('isChange no save ', this.isChange)
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

  addItem() {
    const produtoSelecionado = this.produtoControl.value;
    if ( this.produtoControl.invalid || this.quantidadeControl.invalid) {
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
    if(novoItem.idItensDaOS == 0){
      this.itensOsService.adicionarItem(novoItem).subscribe({
        next: () => {
          this.os.itensOS.push(novoItem); // só para UI
          //this.updateTotal();
        }
      });
    }
    this.voltar();
    this.dialogRef.close();
    /* limpa os campos
    this.produtoControl.reset();*/
  }

  editarItem(itensOS: iItensOS) {
    // Garanta que os nomes das propriedades aqui sejam exatamente iguais ao ItensDoServicoDTO.java
    const dto = {
      idItensDaOS: itensOS.idItensDaOS,
      codOS: itensOS.codOS,
      codProduto: itensOS.codProduto,
      descricao: itensOS.descricao,
      valorUnitario: itensOS.valorUnitario,
      quantidade: itensOS.quantidade,
      total: itensOS.valorUnitario * itensOS.quantidade // Envia calculado por segurança
    };

    this.itensOsService.editItem(dto).subscribe({
      next: (res) => this.dialogRef.close(res),
      error: (err) => console.error("Erro detalhado:", err)
    });
  }

  finalizarOS() {
    this.os.status = 'FINALIZADA';
    this.osServices.update(this.os).subscribe();
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

  displayStatus(status: string): string {
    return status ? status : '';
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
/*
  statusDaOS(){
    console.log('os.idOS NO STATUS', this.os.idOS)
    if (this.os.idOS === 0) {
      this.isNewOS = true;
      this.isChange = true;
    } if (this.os.idOS > 0 && this.dialogRef.componentInstance.data.modoNew === "editar") {
      console.log('isNewOS NO ELSE',  this.isNewOS)
      this.isChange = false;
      this.isNewOS = true;
    }
  }
*/

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
