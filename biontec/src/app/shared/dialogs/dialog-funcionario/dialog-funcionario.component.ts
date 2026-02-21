import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
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
  iFuncionario!: IFuncionario;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    public dialogRef: MatDialogRef<DialogFuncionarioComponent>,
    private cepService: ConsultaCepService
  ) {
    console.log('Data funcionário ', data);
  }


  ngOnInit(): void {
    if (this.iFuncionario.idfuncionario != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }

  consultaCEP(cep:string, form:NgForm) {
    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');
    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
       // .subscribe(dados => this.populaDadosForm(dados, form));
       .subscribe(dados => console.log('CEP consultado', dados ));
    }
  }
  populaDadosForm(dados:any, formulario:any) {
    formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        rua: dados.logradouro,
        cep: dados.cep,
        numero: '',
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
    formulario.form.patchValue({
      endereco: {
        rua: dados.logradouro,
        // cep: dados.cep,
        complemento: dados.complemento,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
     console.log(formulario);
  }
  resetaDadosForm(formulario:any) {
    formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}

