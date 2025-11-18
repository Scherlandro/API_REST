import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, of } from 'rxjs';
import { ItensVdService } from 'src/app/services/itens-vd.service';
import {ItensOsService} from "../../../services/itens-os.service";
import {ProductService} from "../../../services/product.service";
import {iProduto} from "../../../interfaces/product";
import {iItensOS} from "../../../interfaces/itens-os";

@Component({
  selector: 'app-dialog-editor-itens-os',
  templateUrl: './dialog-itens-os.component.html',
  styleUrls: ['./dialog-itens-os.component.css']
})
export class DialogItensOSComponent implements OnInit {
  isChange!: boolean;
  produtoFiltered: iProduto[] = [];
  products: iProduto[] = [];
  produtoControl: FormControl;
  quantidadeControl: FormControl;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public itensOS: iItensOS,
    public dialogRef: MatDialogRef<DialogItensOSComponent>,
    private itensOsService: ItensOsService,
    private itensVdService: ItensVdService,
    private prodService: ProductService
  ) {
    this.produtoControl = new FormControl(null, [Validators.required]);
    this.quantidadeControl = new FormControl(null, [Validators.required, Validators.min(1)]); // Validação para quantidade
  }


  ngOnInit(): void {
    // Garante que o objeto e subobjetos estejam inicializados
    if (!this.itensOS) this.itensOS = {} as iItensOS;
    if (!this.itensOS.prod) this.itensOS.prod = {} as iProduto;

    this.listarProdutos();
    this.isChange = !!this.itensOS.prod.idProduto;

    // Se já houver um produto, preenche os campos
    if (this.itensOS.prod && this.itensOS.prod.nomeProduto) {
      this.produtoControl.setValue(this.itensOS.prod);
      this.updateItemFields(this.itensOS.prod); // Atualiza os campos ao iniciar
    }

    this.produtoControl.valueChanges.subscribe((produto: iProduto | string | null) => {
      if (produto && typeof produto !== 'string') {
        this.itensOS.prod = produto;
        this.updateItemFields(produto); // Atualiza os campos ao selecionar um produto
      }
    });
  }

  // Função para atualizar os campos do itensOS com base no produto selecionado
  updateItemFields(produto: iProduto) {
    this.itensOS.codProd = produto.codProduto;
    this.itensOS.descricao = produto.nomeProduto;
    this.itensOS.precoDeVenda = produto.valorVenda;

    // Atualiza o total com base na quantidade e preço de venda
    this.updateTotal();
  }

  // Função para atualizar o total com base no preço de venda e quantidade
  updateTotal() {
    if (this.itensOS.precoDeVenda && this.itensOS.quantidade) {
      this.itensOS.total = this.itensOS.precoDeVenda * this.itensOS.quantidade;
    } else {
      this.itensOS.total = 0;
    }
  }


  listarProdutos() {
    this.prodService.getTodosProdutos()
      .pipe(
        catchError(error => {
          this.onError('Erro ao buscar produtos.');
          console.error(error);
          return of([]);
        })
      )
      .subscribe((res: iProduto[]) => {
        this.products = res;
        this.produtoFiltered = res;
      });
  }


  displayPd(produto: iProduto): string {
    return produto ? produto.nomeProduto : '';
  }

  changeProduto(value: string): void {
    if (value) {
      const val = value.toUpperCase();
      this.produtoFiltered = this.products.filter(
        p => p.nomeProduto.toUpperCase().includes(val)
      );
    } else {
      this.produtoFiltered = this.products;
    }
  }

  onError(message: string): void {
    console.error(message);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.produtoControl.valid && this.quantidadeControl.valid) {
      const itens = this.itensOS;
      this.itensOsService.adicionarItem(itens);
    }
  }

  formatter(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL' }).format(value);
  }

  // Método que valida se o botão "Salvar" deve ser habilitado
  isSaveButtonDisabled(): boolean {
    return !(this.produtoControl.valid && this.quantidadeControl.valid);
  }

}

