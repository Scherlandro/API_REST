import {Inject, NgModule, signal} from '@angular/core';
import {Component, OnInit, ViewChild} from '@angular/core';
import {ICredential} from 'src/app/interfaces/credential';
import {AuthService} from 'src/app/services/auth.service';
import {TokenService} from 'src/app/services/token.service';
import { MatDialog} from "@angular/material/dialog";
import {UserService} from "../../services/user.service";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {IUser} from "../../interfaces/user";
import {DialogUsuarioComponent} from "../../shared/dialogs/dialog-usuario/dialog-usuario.component";
import {delay} from "rxjs/operators";
import {FormControl, Validators,FormBuilder, FormGroup} from '@angular/forms';
import {IpService} from "../../services/ip.service";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {PurchaseStateService} from "../../services/purchase-state.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userIp = '';
  @ViewChild(MatTable) tableUser!: MatTable<any>;
  tbSourceUsuarios$ = new MatTableDataSource<IUser>();
  showErrorMessage= '';
  spiner = false;
  hide = signal(true);
  formLogin!: FormGroup;
  form: ICredential = {
    username: '',
    password: ''
  }
  username: FormControl;

  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private userService: UserService,
    private purchaseState: PurchaseStateService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private ipService: IpService,
    public notificationMsg: NotificationMgsService,
    ) {
    this.formLogin = this.criarFormLogin();
    this.username = new FormControl('', [Validators.required, Validators.email]);
  }

  ngOnInit(): void {
    this.ipService.getIpAddress().subscribe(data => {
      this.userIp = data.ip;
      console.log('Seu ip ', this.userIp);
    });
  }

  criarFormLogin(): FormGroup {
    return this.fb.group({
      username: ["", [Validators.required, Validators.minLength(6), Validators.email]],
     // username1: ["", [Validators.required,Validators.email,this.domainValidator ]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  domainValidator(control: any) {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const [_, domain] = email.split('@');
       if (domain !== 'empresa.com') { // Depois alterar para o domínio desejado
      console.log('Valor domain ', domain)
      return { invalidDomain: true };
       }  }
    return null;
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  newAccount(): void {
    const dialogRef = this.dialog.open(DialogUsuarioComponent, {
      width: '300px',
      data: { id: null, name: '', username: '',  password: ''   }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) { this.notificationMsg.success('Novo usuário criado com sucesso!');  }
    });
  }

  getErrorMessage(){
    const emailControl = this.formLogin.get('username');
    return emailControl?.hasError('required') ? 'O e-mail é obrigatório' :
      emailControl?.hasError('email') ? 'Formato inválido (user@email.com)' : '' ;
  }

  onSubmit(): void {
    if (this.formLogin.valid) {
      this.spiner = true;
      const loginData: ICredential = this.formLogin.value;
      this.authService.login(loginData).pipe(delay(1500))
        .subscribe( (data: { access_token: string; }) => {
            this.tokenService.saveToken(data.access_token);
            this.spiner = false;
          },
          error => {
            this.showErrorMessage = error.status;
            this.spiner = false;
          }
        );
      /*
    localStorage.setItem('currentUser',JSON.stringify(data));
     if(data.user.role==='ADMIN') {
       this.data.navigate(['/admindashboard']);
     } else {
       this.data.navigate(['/userdashboard']);
     }*/
    }
  }

  clearInput() {
    this.formLogin.reset();
    this.spiner = false;
    this.showErrorMessage = '';
  }

}
