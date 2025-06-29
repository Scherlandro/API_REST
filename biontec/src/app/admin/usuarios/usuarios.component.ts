import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {IUser} from 'src/app/interfaces/user';
import {UserService} from 'src/app/services/user.service';
import {FormControl} from '@angular/forms';
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DialogUsuarioComponent} from "../../shared/diolog_components/dialog-usuario/dialog-usuario.component";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {NotificationMgsService} from "../../services/notification-mgs.service";
import {catchError} from "rxjs/operators";
import {of} from "rxjs";
import {ErrorDiologComponent} from "../../shared/diolog_components/error-diolog/error-diolog.component";
import {SelectionModel} from "@angular/cdk/collections";

import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})

export class UsuariosComponent implements OnInit {

  @ViewChild(MatTable) tableUser!: MatTable<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [ 'nome_usuario', 'email', 'opicoes'];
  tbData:any;
  tbSourceUsuarios$:MatTableDataSource<IUser>;
  selection = new SelectionModel<Element>(true, []);
  isChange!: boolean;
  usuarioControl = new FormControl();
  elementsFilter: any[] = [];
  ruwSelec: any;

  constructor(public dialog: MatDialog,
              private userService: UserService,
              public notificationMsg:  NotificationMgsService,
              private tokenServer: TokenService,
              private detectChange: ChangeDetectorRef
  ) {
   this.tbSourceUsuarios$ = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.listarUsuarios();
  }

    listarUsuarios() {
    this.userService.getAllUsers()
      .pipe(catchError(error => {
        if(error === 'Session Expired')
        this.onError('Sua sessão expirou!');
           this.tokenServer.clearTokenExpired();
        return of([])
      }))
      .subscribe((rest: IUser[]) => {
       this.tbSourceUsuarios$.data = rest;
      // this.detectChange.detectChanges();
        this.tbSourceUsuarios$.paginator = this.paginator;
      });
  }

  consultarPorNome(nome: string) {
    if (this.usuarioControl.valid) {
      this.userService.getUser(nome)
        .pipe(catchError(error => {
          this.onError('Erro ao buscar usuário.')
          return of([])
        }))
        .subscribe((res: IUser[]) => {
          this.aplicarFiltro(nome);
          this.tbSourceUsuarios$.data = res;
        })
    }
  }

  aplicarFiltro(valor: string) {
    valor = valor.trim().toLowerCase();
    this.tbSourceUsuarios$.filter = valor;
  }

  openDialogo(eventUser: IUser) {
    const dialogRef = this.dialog.open(DialogUsuarioComponent, {
      width: '300px',
      data: eventUser === null? {
        id_usuario: null,
        name: '',
        username: '',
        password: ''
      }: {
        id_usuario: eventUser.id_usuario,
        name: eventUser.name,
        username: eventUser.username,
        password: eventUser.password
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        if (this.tbSourceUsuarios$.data
          .map(p => p.id_usuario).includes(result.id_user)) {
          this.userService.editarUsuario(result)
            .subscribe((data: IUser) => {
              const index = this.tbSourceUsuarios$.data
                .findIndex(p => p.id_usuario === data.id_usuario);
              this.tbSourceUsuarios$.data[index] = data;
              this.tableUser.renderRows();
            });
        } else {
          this.userService.createUsuario(result)
            .subscribe((data: IUser) => {
              this.tbSourceUsuarios$.data.push(result);
              this.tableUser.renderRows();
            });
        }}});
  }

  editarElement(eventUser: IUser) {
    this.openDialogo(eventUser);
  }

  deleteElement(user: IUser) {
      this.notificationMsg.openConfirmDialog('Tem certeza em REMOVER este usuário ?')
    .afterClosed().subscribe(res =>{
      if(res){
        this.userService.deleteUsuario(user)
          .subscribe((item) => {
            this.tbData  = this.tbSourceUsuarios$.data;
            this.tbData.splice( this.ruwSelec,1);
            this.tbSourceUsuarios$.data = this.tbData;
          });
        this.notificationMsg.warn('! Deletado com sucesso!');
      }
    });
  }

  onError(errrorMsg: string) {
    this.dialog.open(ErrorDiologComponent, {
      data: errrorMsg
    });
  }

  onMatSortChange() {
    this.tbSourceUsuarios$.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.tbSourceUsuarios$.data.length;
    return numSelected === numRows;
  }

  removeSelectedRows() {
  //   https://stackblitz.com/edit/delete-rows-mat-table?file=app%2Ftable-selection-example.html
    this.selection.selected.forEach(item => {
      let index: number = this.tbData.findIndex((d:any) => d === item);
      console.log('Index no RemoveSelectedRows ->',index);
      this.tbData.splice(index,1)
      this.tbSourceUsuarios$ = new MatTableDataSource(this.tbData);
    });
    this.selection = new SelectionModel<Element>(true, []);
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.tbSourceUsuarios$.data.forEach((row:any) => this.selection.select(row));
  }

  selectRow(row:any){
  this.ruwSelec = this.tbSourceUsuarios$.filteredData.indexOf(row);
   const coutRow = this.elementsFilter.push(this.ruwSelec);
    console.log('Qt de linhas', coutRow)
    this.isChange = !this.isChange;
  }

  /*
  onEdit(row){
    this.service.populateForm(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EmployeeComponent,dialogConfig);
  }
   */

}
