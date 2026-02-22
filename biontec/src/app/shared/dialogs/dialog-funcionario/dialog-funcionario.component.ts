import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {NgForm} from "@angular/forms";
import {ConsultaCepService} from "../../../services/consulta-cep.service";
import {IFuncionario} from "../../../interfaces/funcionario";

@Component({
  selector: 'app-dialog-funcionario-editor',
  templateUrl: './dialog-funcionario.component.html',
  styleUrls: ['./dialog-funcionario.component.css']
})
export class DialogFuncionarioComponent implements OnInit {

  isChange!: boolean;
  funcionario$!: IFuncionario;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialogRef: MatDialogRef<DialogFuncionarioComponent>,
    private cepService: ConsultaCepService
  ) {
    this.funcionario$ = data as any;

    console.log('Data funcionário ', data);
  }


  ngOnInit(): void {
    if (this.funcionario$.idFuncionario != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

 consultaCEP(cep: string) {
    // Limpa caracteres não numéricos
    cep = cep.replace(/\D/g, '');
    if (cep !== '') {
      this.cepService.consultaCEP(cep).subscribe((dados: any) => {
        if (!dados.erro) {
          this.populaDadosForm(dados);
        } else {
          alert("CEP não encontrado.");
          this.resetaDadosForm();
        }
      });
    }
  }

  populaDadosForm(dados: any) {
    if (dados.logradouro) {
      // Divide a string em um array de palavras
      const partesLogradouro = dados.logradouro.split(' ');
      // O primeiro item do array (ex: 'Rua') vai para o tipo
      this.funcionario$.tipo_logradouro = partesLogradouro[0];
      // O restante (ex: 'Augusta') volta para o logradouro
      // .slice(1) pega do segundo item em diante, .join(' ') junta novamente com espaços
     // this.funcionario$.logradouro = partesLogradouro.slice(1).join(' ');
    }
    this.funcionario$.logradouro = dados.logradouro;
    this.funcionario$.bairro = dados.bairro;
    this.funcionario$.cidade = dados.localidade;
    this.funcionario$.uf = dados.uf;
    this.funcionario$.complemento = dados.complemento;
  }

  resetaDadosForm() {
    this.funcionario$.logradouro = '';
    this.funcionario$.bairro = '';
    this.funcionario$.cidade = '';
    this.funcionario$.uf = '';
    this.funcionario$.complemento = '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

