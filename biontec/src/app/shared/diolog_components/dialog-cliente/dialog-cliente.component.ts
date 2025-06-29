import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ICliente} from "../../../interfaces/cliente";
import {NgForm} from "@angular/forms";
import {ConsultaCepService} from "../../../services/consulta-cep.service";

@Component({
  selector: 'app-dialog-editor',
  templateUrl: './dialog-cliente.component.html',
  styleUrls: ['./dialog-cliente.component.css']
})
export class DialogClienteComponent implements OnInit {
 element!: ICliente;
  isChange!: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public iCliente: ICliente,
    public dialogRef: MatDialogRef<DialogClienteComponent>,
    private cepService: ConsultaCepService
  ) {}


  ngOnInit(): void {
    if (this.iCliente.id_cliente != null) {
      this.isChange = true;
    } else {
      this.isChange = false;
    }
  }
//  https://www.fabricadecodigo.com/criar-formulario-reactive-forms/
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

